import { PipelineStep } from "./PipelineStep";
import { Skeleton } from "@/components/ui/skeleton";

interface Step { name: string; status: "pending" | "running" | "completed" | "failed"; }
interface Props { steps: Step[]; loading?: boolean; }

export function PipelineProgress({ steps, loading }: Props) {
  if (loading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>;
  }
  return (
    <div className="space-y-2">
      {steps.map((step, i) => (<PipelineStep key={i} name={step.name} status={step.status} />))}
    </div>
  );
}
