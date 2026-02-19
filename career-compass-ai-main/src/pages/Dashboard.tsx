import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  User, Target, Lightbulb, AlertTriangle, CheckSquare, BookOpen,
  Mail, Phone, Linkedin, Globe, ArrowLeft, ChevronRight, Check, Briefcase, History
} from "lucide-react";
import logo from "@/assets/logo.png";
import ScoreCircle from "@/components/ScoreCircle";
import QuizModule from "@/components/QuizModule";
import { mockAnalysis } from "@/data/mockData";

const categoryColors: Record<string, string> = {
  Web: "bg-blue-100 text-blue-700 border-blue-200",
  IA: "bg-purple-100 text-purple-700 border-purple-200",
  Multimedia: "bg-pink-100 text-pink-700 border-pink-200",
  DevOps: "bg-orange-100 text-orange-700 border-orange-200",
};

const prioriteColors: Record<string, string> = {
  haute: "bg-destructive/10 text-destructive border-destructive/20",
  moyenne: "bg-score-yellow/10 text-score-yellow border-score-yellow/20",
  basse: "bg-muted text-muted-foreground border-border",
};

const Dashboard = () => {
  const location = useLocation();
  const data = (location.state as any)?.analysis || mockAnalysis;
  const [recommandations, setRecommandations] = useState(data?.recommandations || []);
  const [activeTab, setActiveTab] = useState<"overview" | "quiz">("overview");

  // Parser pour convertir **texte** en gras
  const parseText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, idx) => {
      if (part.match(/^\*\*.*\*\*$/)) {
        return <strong key={idx}>{part.replace(/\*\*/g, "")}</strong>;
      }
      return part;
    });
  };

  const toggleRecommandation = (id: number) => {
    setRecommandations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, fait: !r.fait } : r))
    );
  };

  const completedCount = recommandations.filter((r) => r.fait).length;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ELEVORA AI" className="w-[135px] h-[50px]" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${activeTab === "overview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${activeTab === "quiz" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                Quiz
              </button>
            </div>
            <Link
              to="/history"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
              title="Historique des analyses"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Historique</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/upload" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Nouvelle analyse
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Analyse pour <span className="text-gradient">{data.poste_vise}</span>
          </h1>
        </motion.div>

        {activeTab === "overview" ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Profile card */}
              <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-card-foreground">Profil</h2>
                </div>
                <h3 className="mb-2 text-xl font-bold text-card-foreground">{data.profil.nom}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{data.profil.resume}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.profil.langues.map((l) => (
                    <span key={l} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      <Globe className="mr-1 inline h-3 w-3" />{l}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{data.profil.contact.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{data.profil.contact.telephone}</span>
                  <span className="flex items-center gap-1"><Linkedin className="h-4 w-4" />{data.profil.contact.linkedin}</span>
                </div>
              </motion.div>

              {/* Skills */}
              <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Lightbulb className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-card-foreground">Compétences détectées</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.skills.map((skill) => (
                    <div key={skill.nom} className="rounded-xl border border-border bg-background p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-card-foreground">{skill.nom}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${categoryColors[skill.categorie] || "bg-muted text-muted-foreground"}`}>
                          {skill.categorie}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.niveau}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <span className="mt-1 block text-right text-xs text-muted-foreground">{skill.niveau}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Experience */}
              {data.experience && data.experience.length > 0 && (
                <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                      <Briefcase className="h-5 w-5 text-accent" />
                    </div>
                    <h2 className="font-display text-lg font-semibold text-card-foreground">Expérience</h2>
                  </div>
                  <div className="space-y-4">
                    {data.experience.map((exp: any, index: number) => (
                      <div key={index} className="rounded-xl border border-border bg-background p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-card-foreground">{exp.title}</h3>
                            <p className="text-sm text-accent">{exp.company}</p>
                            {exp.duration && <p className="text-xs text-muted-foreground mt-1">{exp.duration}</p>}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Missing Skills */}
              <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-card-foreground">Compétences manquantes</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.missing_skills.map((s) => (
                    <div key={s.nom} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${prioriteColors[s.priorite]}`}>
                      <span>{s.nom}</span>
                      <span className="text-xs opacity-70">({s.type})</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Score */}
              <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-card-foreground">Score Matching</h2>
                </div>
                <div className="flex justify-center py-4">
                  <ScoreCircle score={data.score} />
                </div>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Compatibilité avec le poste de <span className="font-medium text-foreground">{data.poste_vise}</span>
                </p>
              </motion.div>

              {/* Recommandations */}
              <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                      <CheckSquare className="h-5 w-5 text-accent" />
                    </div>
                    <h2 className="font-display text-lg font-semibold text-card-foreground">Recommandations</h2>
                  </div>
                  <span className="text-sm font-medium text-accent">{completedCount}/{recommandations.length}</span>
                </div>
                <div className="space-y-2">
                  {recommandations.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => toggleRecommandation(r.id)}
                      className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                        r.fait
                          ? "border-accent/30 bg-accent/5"
                          : "border-border hover:border-accent/20"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                        r.fait ? "border-accent bg-accent" : "border-border"
                      }`}>
                        {r.fait && <Check className="h-3 w-3 text-accent-foreground" />}
                      </div>
                      <span className={`text-sm ${r.fait ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                        {parseText(r.texte)}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Quiz tab */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-card md:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <h2 className="font-display text-lg font-semibold text-card-foreground">QCM d'entraînement</h2>
            </div>
            <QuizModule questions={data.quiz} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
