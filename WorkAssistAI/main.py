# Bibliothèques

import os
import json
import uvicorn
import pdfplumber
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from google.api_core.exceptions import ResourceExhausted  


# Variables d'environnements 

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

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


def extract_text_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text


def get_fallback_json():
    """Return mock data when API quota is exceeded"""
    return {
        "name": "Candidat - Mode Hors-ligne",
        "summary": "La quota API Gemini a été dépassée. Réessayez plus tard ou passez au plan payant.",
        "contacts": {"email": "example@email.com", "phone": [], "birth_date": ""},
        "skills": [
            {"name": "JavaScript", "description": "Développement frontend"},
            {"name": "Python", "description": "Développement backend"}
        ],
        "experience": [
            {"title": "Développeur", "company": "Exemple Inc", "duration": "2023-2024", "description": "Exemple"}
        ],
        "languages": ["Français", "Anglais"],
        "score_match": 0,
        "missing_skills": [],
        "recommendations": ["Réessayez après 24h"],
        "qcm_cards": []
    }


def cv_to_json(content, poste_vise):
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")

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

    response = model.generate_content(prompt)
    txt = response.text.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(txt)
    except ResourceExhausted as e:
        print(f"API Quota exceeded: {str(e)[:100]}")
        return get_fallback_json()
    except json.JSONDecodeError as e:
        return {"error": "Invalid JSON from API", "exception": str(e)}
    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}


@app.post("/analyze_cv")
def analyze_cv(file: UploadFile, poste_vise: str = Form(...)):
    content = extract_text_from_pdf(file.file)
    return cv_to_json(content, poste_vise)


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
