import { cn } from "@/lib/utils";

interface Props { score: number; size?: "sm" | "md" | "lg"; }

export function ResellScoreGauge({ score, size = "md" }: Props) {
  const color = score >= 70 ? "text-score-green" : score >= 40 ? "text-score-yellow" : "text-score-red";
  const bgColor = score >= 70 ? "bg-score-green/20" : score >= 40 ? "bg-score-yellow/20" : "bg-score-red/20";
  const label = score >= 70 ? "Banger" : score >= 40 ? "Okay" : "Ladenhueter";
  const sizeClasses = { sm: "h-16 w-16 text-lg", md: "h-24 w-24 text-2xl", lg: "h-32 w-32 text-3xl" };

  return (
    <div className={cn("flex flex-col items-center gap-1")}>
      <div className={cn("flex items-center justify-center rounded-full border-2", sizeClasses[size], bgColor, `border-current ${color}`)}>
        <span className={cn("font-bold", color)}>{score}</span>
      </div>
      <span className={cn("text-xs font-medium", color)}>{label}</span>
    </div>
  );
}
