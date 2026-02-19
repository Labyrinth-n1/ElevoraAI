import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explication: string;
}

interface QuizModuleProps {
  questions: QuizQuestion[];
}

const QuizModule = ({ questions }: QuizModuleProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-8 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 className="h-8 w-8 text-accent" />
        </div>
        <h3 className="font-display text-2xl font-bold text-card-foreground">Quiz terminé !</h3>
        <p className="text-3xl font-bold text-accent">{correctCount} / {questions.length}</p>
        <p className="text-muted-foreground">Score : {pct}%</p>
        <button
          onClick={() => {
            setCurrentQ(0);
            setSelected(null);
            setAnswered(false);
            setCorrectCount(0);
            setFinished(false);
          }}
          className="mt-4 rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90"
        >
          Recommencer
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {currentQ + 1} / {questions.length}</span>
        <span className="font-semibold text-accent">{correctCount} correct{correctCount > 1 ? "s" : ""}</span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-accent"
          animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h4 className="mb-5 font-display text-lg font-semibold text-card-foreground">{q.question}</h4>
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let classes = "w-full rounded-xl border p-4 text-left text-sm font-medium transition-all ";
              if (!answered) {
                classes += "border-border bg-card text-card-foreground hover:border-accent/50 hover:bg-accent/5 cursor-pointer";
              } else if (idx === q.correct) {
                classes += "border-score-green bg-score-green/10 text-score-green";
              } else if (idx === selected) {
                classes += "border-score-red bg-score-red/10 text-score-red";
              } else {
                classes += "border-border bg-card text-muted-foreground opacity-50";
              }

              return (
                <button key={idx} className={classes} onClick={() => handleSelect(idx)}>
                  <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                  {answered && idx === q.correct && <CheckCircle2 className="ml-auto inline h-5 w-5" />}
                  {answered && idx === selected && idx !== q.correct && <XCircle className="ml-auto inline h-5 w-5" />}
                </button>
              );
            })}
          </div>

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-xl border border-accent/20 bg-accent/5 p-4"
            >
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-accent">
                <HelpCircle className="h-4 w-4" /> Explication
              </div>
              <p className="text-sm text-muted-foreground">{q.explication}</p>
            </motion.div>
          )}

          {answered && (
            <button
              onClick={handleNext}
              className="mt-5 w-full rounded-xl bg-accent py-3 font-semibold text-accent-foreground transition-all hover:opacity-90"
            >
              {currentQ + 1 >= questions.length ? "Voir le résultat" : "Question suivante"}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizModule;
