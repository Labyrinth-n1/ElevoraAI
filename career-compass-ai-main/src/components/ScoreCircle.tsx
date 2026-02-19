import { motion } from "framer-motion";

interface ScoreCircleProps {
  score: number;
  size?: number;
}

const ScoreCircle = ({ score, size = 160 }: ScoreCircleProps) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColorClass = () => {
    if (score <= 40) return "text-score-red";
    if (score <= 70) return "text-score-yellow";
    return "text-score-green";
  };

  const getStrokeColor = () => {
    if (score <= 40) return "hsl(var(--score-red))";
    if (score <= 70) return "hsl(var(--score-yellow))";
    return "hsl(var(--score-green))";
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className={`font-display text-3xl font-bold ${getColorClass()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
};

export default ScoreCircle;
