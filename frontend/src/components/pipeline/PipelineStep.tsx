import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { name: string; status: "pending" | "running" | "completed" | "failed"; }

export function PipelineStep({ name, status }: Props) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg border p-3 transition-all", status === "completed" && "border-green-500/30 bg-green-500/5", status === "running" && "border-primary/30 bg-primary/5", status === "failed" && "border-destructive/30 bg-destructive/5")}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full border">
        {status === "completed" && <Check className="h-4 w-4 text-green-400" />}
        {status === "running" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        {status === "failed" && <X className="h-4 w-4 text-destructive" />}
        {status === "pending" && <div className="h-2 w-2 rounded-full bg-muted-foreground" />}
      </div>
      <span className={cn("text-sm", status === "running" && "font-medium")}>{name}</span>
    </div>
  );
}
