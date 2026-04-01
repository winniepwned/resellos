import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props { 
  score: number; 
  size?: "sm" | "md" | "lg"; 
}

export function ResellScoreGauge({ score, size = "md" }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 smoothly on mount
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const color = score >= 70 ? "text-score-green" : score >= 40 ? "text-score-yellow" : "text-score-red";
  const label = score >= 70 ? "Banger" : score >= 40 ? "Okay" : "Ladenhüter";
  
  const sizeClasses = { 
    sm: "w-24 h-14", 
    md: "w-32 h-20", 
    lg: "w-48 h-28" 
  };
  
  const textSizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl"
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn("relative flex items-end justify-center", sizeClasses[size])}>
        <svg
          viewBox="0 0 100 55"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          {/* Background track */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-muted"
          />
          {/* Foreground colored track */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            className={cn("transition-all duration-1000 ease-out", color)}
            strokeWidth="8"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100 100"
            strokeDashoffset={100 - animatedScore}
          />
        </svg>
        <div className={cn("z-10 font-bold leading-none tracking-tighter mb-1", color, textSizeClasses[size])}>
          {score}
        </div>
      </div>
      <span className={cn("text-xs font-bold uppercase tracking-wider", color)}>{label}</span>
    </div>
  );
}
