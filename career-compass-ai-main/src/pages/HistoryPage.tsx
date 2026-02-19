import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Brain, ArrowLeft, Trash2, Eye, Calendar } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import ScoreCircle from "@/components/ScoreCircle";

const HistoryPage = () => {
  const { history, deleteAnalysis, clearHistory } = useAnalysisHistory();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleViewAnalysis = (analysisData: any) => {
    navigate("/dashboard", { state: { analysis: analysisData } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ELEVORA AI" className="w-[135px] h-[50px]" />
          </Link>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" /> Nouvelle analyse
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Historique des analyses
          </h1>
          <p className="mt-2 text-muted-foreground">
            {history.length} analyse{history.length !== 1 ? "s" : ""} sauvegardée{history.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Brain className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-display text-lg font-semibold text-card-foreground">
              Aucune analyse sauvegardée
            </h3>
            <p className="mt-2 text-muted-foreground">
              Commencez par télécharger et analyser un CV
            </p>
            <Link
              to="/upload"
              className="mt-6 rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90"
            >
              Analyser un CV
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {history.map((record, idx) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-lg hover:border-accent/30"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-card-foreground">{record.name}</h3>
                      <p className="text-sm text-accent">{record.poste_vise}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center">
                      <ScoreCircle score={record.score} size={80} />
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {record.date}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewAnalysis(record.data)}
                      className="flex-1 rounded-lg bg-accent/10 px-3 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/20"
                    >
                      <Eye className="mr-1 inline h-4 w-4" /> Voir
                    </button>
                    <button
                      onClick={() => setConfirmDelete(record.id)}
                      className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Confirmation dialog */}
                  {confirmDelete === record.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm"
                    >
                      <div className="rounded-lg bg-card p-4 text-center">
                        <p className="mb-4 text-sm font-medium text-card-foreground">
                          Supprimer cette analyse ?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-border/60"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => {
                              deleteAnalysis(record.id);
                              setConfirmDelete(null);
                            }}
                            className="flex-1 rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground transition-all hover:opacity-90"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex justify-center"
              >
                <button
                  onClick={() => {
                    if (confirm("Êtes-vous sûr de vouloir vider l'historique ?")) {
                      clearHistory();
                    }
                  }}
                  className="rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/10"
                >
                  Vider l'historique
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
