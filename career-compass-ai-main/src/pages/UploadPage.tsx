import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, ArrowRight, Brain, Briefcase, History } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

const UploadPage = () => {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [poste, setPoste] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveAnalysis } = useAnalysisHistory();
  const navigate = useNavigate();

  const handleFile = (f: File) => {
    if (f.type === "application/pdf") {
      setFile(f);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !poste) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("poste_vise", poste);
      const res = await fetch("https://elevoraai-3.onrender.com/analyze_cv", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Erreur API");
      const apiData = await res.json();
      
      // Mapper les skills à la structure attendue
      const mappedSkills = apiData.skills.map((skill: any) => {
        // Déterminer la catégorie à partir de la description
        const desc = skill.description.toLowerCase();
        let categorie = "Autre";
        if (desc.includes("programmation")) categorie = "Web";
        else if (desc.includes("web")) categorie = "Web";
        else if (desc.includes("front")) categorie = "Web";
        else if (desc.includes("back")) categorie = "Web";
        else if (desc.includes("machine learning") || desc.includes("deep learning")) categorie = "IA";
        else if (desc.includes("langage naturel") || desc.includes("nlp")) categorie = "IA";
        else if (desc.includes("vision") || desc.includes("computer vision")) categorie = "IA";
        else if (desc.includes("devops") || desc.includes("conteneurisation") || desc.includes("docker")) categorie = "DevOps";
        else if (desc.includes("design")) categorie = "Multimedia";
        
        return {
          nom: skill.name,
          description: skill.description,
          niveau: 65, // niveau par défaut
          categorie: categorie,
        };
      });
      
      // Transformer missing_skills en objets
      const mappedMissingSkills = apiData.missing_skills.map((skill: string, index: number) => ({
        nom: skill,
        priorite: index < 3 ? "haute" : index < 5 ? "moyenne" : "basse",
        type: "Compétence",
      }));
      
      // Transformer recommendations (array de strings) en recommandations structurées
      const mappedRecommendations = apiData.recommendations
        .filter((rec: string) => rec && typeof rec === 'string' && rec.trim().length > 0 && !rec.startsWith("**"))
        .map((rec: string, index: number) => ({
          id: index + 1,
          texte: rec.startsWith("- ") ? rec.substring(2).trim() : rec.trim(),
          fait: false,
        }));
      

      
      // Transformer qcm_cards en quiz
      const mappedQuiz = apiData.qcm_cards.map((card: any, index: number) => ({
        id: index + 1,
        question: card.question,
        options: card.options,
        correct: card.correct_answer,
        explication: card.explanation,
      }));
      
      // Transformer la réponse de l'API au format attendu
      const transformedData = {
        poste_vise: poste,
        profil: {
          nom: apiData.name || "Non spécifié",
          resume: apiData.summary || "",
          langues: apiData.languages || [],
          contact: {
            email: apiData.contacts?.email || "",
            telephone: Array.isArray(apiData.contacts?.phone) 
              ? apiData.contacts.phone[0] || "" 
              : apiData.contacts?.phone || "",
            linkedin: apiData.contacts?.linkedin || "",
          },
        },
        score: apiData.score_match || 0,
        skills: mappedSkills,
        missing_skills: mappedMissingSkills,
        recommandations: mappedRecommendations,
        quiz: mappedQuiz,
        experience: apiData.experience || [],
      };
      
      // Sauvegarder dans l'historique
      saveAnalysis(transformedData);
      
      navigate("/dashboard", { state: { analysis: transformedData } });
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Erreur lors de l'analyse. Vérifiez que le serveur est lancé.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-hero">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20"
          >
            <Brain className="h-10 w-10 text-emerald" />
          </motion.div>
          <h2 className="mb-2 font-display text-2xl font-bold text-primary-foreground">
            Analyse IA en cours...
          </h2>
          <p className="text-primary-foreground/60">Extraction et analyse de votre profil</p>
          <div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-primary-foreground/10">
            <motion.div
              className="h-full rounded-full gradient-accent"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ELEVORA AI" className="w-[135px] h-[50px]" />
          </Link>
          <Link
            to="/history"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
            title="Historique des analyses"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto max-w-2xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="mb-3 font-display text-3xl font-bold text-foreground">
            Analysez votre CV
          </h1>
          <p className="mb-10 text-muted-foreground">
            Uploadez votre CV et indiquez le poste visé pour obtenir votre analyse personnalisée.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              dragOver
                ? "border-accent bg-accent/5"
                : file
                ? "border-accent/50 bg-accent/5"
                : "border-border hover:border-accent/30 hover:bg-muted/50"
            }`}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                  <FileText className="h-7 w-7 text-accent" />
                </div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(0)} KB • Cliquez pour changer
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                  <Upload className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground">
                  Glissez votre CV ici ou cliquez pour parcourir
                </p>
                <p className="text-sm text-muted-foreground">Format PDF uniquement • Max 10 MB</p>
              </div>
            )}
          </div>

          {/* Poste visé */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Briefcase className="h-4 w-4 text-accent" />
              Poste visé
            </label>
            <input
              type="text"
              value={poste}
              onChange={(e) => setPoste(e.target.value)}
              placeholder="Ex: Développeur Full Stack, Data Analyst, Chef de Projet..."
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!file || !poste}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-semibold text-accent-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Lancer l'analyse IA
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;
