import { useState, useEffect } from "react";

export interface AnalysisRecord {
  id: string;
  date: string;
  name: string;
  poste_vise: string;
  score: number;
  data: any;
}

const STORAGE_KEY = "career-compass-history";

export const useAnalysisHistory = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger l'historique au montage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Erreur lors du chargement de l'historique:", e);
        setHistory([]);
      }
    }
    setLoading(false);
  }, []);

  // Sauvegarder une analyse
  const saveAnalysis = (analysis: any) => {
    const newRecord: AnalysisRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString("fr-FR"),
      name: analysis.profil?.nom || "Analyse",
      poste_vise: analysis.poste_vise,
      score: analysis.score,
      data: analysis,
    };

    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRecord.id;
  };

  // Supprimer une analyse
  const deleteAnalysis = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Récupérer une analyse spécifique
  const getAnalysis = (id: string) => {
    return history.find((item) => item.id === id);
  };

  // Vider tout l'historique
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    loading,
    saveAnalysis,
    deleteAnalysis,
    getAnalysis,
    clearHistory,
  };
};
