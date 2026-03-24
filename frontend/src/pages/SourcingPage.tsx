import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PipelineProgress } from "@/components/pipeline/PipelineProgress";
import { SourcingResultCard } from "@/components/pipeline/SourcingResultCard";
import { useStartSourcing, useSourcingStatus, useSourcingResult } from "@/hooks/useSourcing";
import type { SourcingResult } from "@/types";

export function SourcingPage() {
  const [keyword, setKeyword] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const startSourcing = useStartSourcing();
  const { data: statusData } = useSourcingStatus(taskId);
  const { data: resultData } = useSourcingResult(
    statusData?.status === "completed" ? taskId : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    const result = await startSourcing.mutateAsync({ keyword });
    setTaskId(result.task_id);
  };

  const pipelineSteps = [
    { name: "Marke & Kategorie identifizieren", status: getStepStatus(statusData, 1) },
    { name: "Markt & Konkurrenz scannen", status: getStepStatus(statusData, 2) },
    { name: "Score & Profitabilitaet berechnen", status: getStepStatus(statusData, 3) },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Sourcing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Schnell-Check: Lohnt sich der Kauf?</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              placeholder="z.B. Nike Air Max 90 Gr. 42"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={startSourcing.isPending}>
              {startSourcing.isPending ? "Starte..." : "Analysieren"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {taskId && (
        <PipelineProgress
          steps={pipelineSteps}
          loading={!statusData}
        />
      )}

      {resultData && <SourcingResultCard result={resultData as SourcingResult} />}
    </div>
  );
}

function getStepStatus(
  data: { status: string; pipeline_steps?: unknown } | undefined,
  step: number
): "pending" | "running" | "completed" | "failed" {
  if (!data) return "pending";
  if (data.status === "completed") return "completed";
  if (data.status === "failed") return step <= 1 ? "failed" : "pending";
  const steps = data.pipeline_steps as Record<string, { status?: string }> | undefined;
  const key = `step_${step}`;
  if (steps?.[key]?.status === "completed") return "completed";
  // Estimate current step based on overall status
  if (data.status === "analyzing") return step === 1 ? "running" : "pending";
  return "pending";
}
