# ==============================
# Bibliothèques
# ==============================

import os
import json
import uvicorn
import pdfplumber
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.api_core.exceptions import ResourceExhausted


# ==============================
# Variables d'environnement
# ==============================

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("⚠️ WARNING: GEMINI_API_KEY is not set!")


# ==============================
# FastAPI App
# ==============================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://elevora-ai-two.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# Utils
# ==============================

def extract_text_from_pdf(file):
    """Extract text safely from PDF"""
    text = ""
    try:
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
        return text.strip()
    except Exception as e:
        print("PDF ERROR:", e)
        return ""


def get_fallback_json():
    """Return mock data when API quota is exceeded or error occurs"""
    return {
        "name": "Candidat - Mode Hors-ligne",
        "summary": "Le service IA est temporairement indisponible. Réessayez plus tard.",
        "contacts": {"email": "", "phone": [], "birth_date": ""},
        "skills": [],
        "experience": [],
        "languages": [],
        "score_match": 0,
        "missing_skills": [],
        "recommendations": ["Veuillez réessayer dans quelques minutes."],
        "qcm_cards": []
    }


# ==============================
# Gemini Processing
# ==============================

def cv_to_json(content, poste_vise):

    if not GEMINI_API_KEY:
        print("❌ API KEY missing")
        return get_fallback_json()

    prompt = f"""
      SYSTEM:
      Tu es un assistant IA expert en recrutement. 
      Tu analyses les CV pour extraire uniquement les informations essentielles utilisables pour un front-end et pour préparer le candidat à un entretien.

      USER:
      Voici un CV :

      {content}

      Le candidat souhaite postuler au poste : "{poste_vise}"

      TASK:

      1. Extrait du CV les informations suivantes :
        - "name": Nom complet
        - "summary": résumé synthétique du profil
        - "contacts": emails, téléphones, date de naissance (format ISO YYYY-MM-DD)
        - "skills": compétences avec description simple
        - "experience": titre, entreprise, durée (format YYYY-MM ou YYYY-MM-DD si possible), description
        - "languages": langues parlées

      2. En fonction du poste "{poste_vise}" :
        - Calculer un "score_match" (0-100) basé sur l’adéquation entre les compétences et expériences du candidat et le poste
        - Identifier les "missing_skills" : compétences importantes manquantes pour ce poste
        - Fournir des "recommendations" concrètes pour améliorer CV et préparation à l’entretien

      3. Générer des questions de préparation à l’entretien :
        - "qcm_cards": 3-5 questions techniques ou situational pour le poste, chaque question doit avoir :
            - "question"
            - "options": 3 mauvaises réponses + 1 correcte (dans l’ordre que tu veux)
            - "correct_answer": index de la bonne réponse (0-3)
            - "explanation": courte explication pédagogique

      4. Sortie JSON strict et exploitable pour le front-end :

      {{
        "name": "",
        "summary": "",
        "contacts": {{"email": "", "phone": [], "birth_date": ""}},
        "skills": [{{"name": "", "description": ""}}],
        "experience": [
          {{"title": "", "company": "", "duration": "", "description": ""}}
        ],
        "languages": [],
        "score_match": 0,
        "missing_skills": [],
        "recommendations": [],
        "qcm_cards": [
          {{"question": "", "options": [], "correct_answer": 0, "explanation": ""}}
        ]
      }}

      Important :
      - Répond uniquement en JSON strictement valide.
      - Formate les dates de manière officielle (ISO YYYY-MM ou YYYY-MM-DD).
      - Priorise la clarté et la précision.
      """ 

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-3-flash-preview")

        response = model.generate_content(prompt)

        if not response or not response.text:
            print("⚠️ Empty Gemini response")
            return get_fallback_json()

        txt = response.text.replace("```json", "").replace("```", "").strip()

        return json.loads(txt)

    except ResourceExhausted:
        print("⚠️ Gemini quota exceeded")
        return get_fallback_json()

    except json.JSONDecodeError as e:
        print("⚠️ Invalid JSON from Gemini:", e)
        return get_fallback_json()

    except Exception as e:
        print("⚠️ Gemini ERROR:", e)
        return get_fallback_json()


# ==============================
# Endpoint
# ==============================

@app.post("/analyze_cv")
def analyze_cv(file: UploadFile, poste_vise: str = Form(...)):

    try:
        content = extract_text_from_pdf(file.file)

        if not content:
            raise HTTPException(status_code=400, detail="PDF vide ou non lisible")

        result = cv_to_json(content, poste_vise)

        return result

    except HTTPException as e:
        raise e

    except Exception as e:
        print("ANALYZE ERROR:", e)
        return get_fallback_json()


# ==============================
# Run local
# ==============================

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)