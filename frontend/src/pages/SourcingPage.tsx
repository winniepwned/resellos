import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PipelineProgress } from "@/components/pipeline/PipelineProgress";
import { SourcingResultCard } from "@/components/pipeline/SourcingResultCard";
import { useQuickCheck } from "@/hooks/useSourcing";
import type { SourcingResult } from "@/types";
import { Search } from "lucide-react";

export function SourcingPage() {
  const [keyword, setKeyword] = useState("");
  const quickCheck = useQuickCheck();
  const [result, setResult] = useState<SourcingResult | null>(null);
  
  // Pipeline animation state
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quickCheck.isPending) {
      setCurrentStep(1);
      // Simulate pipeline progression visually while backend does the real work
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 1500);
    } else if (quickCheck.isSuccess) {
      setCurrentStep(4); // All done
    } else {
      setCurrentStep(0);
    }
    return () => clearInterval(interval);
  }, [quickCheck.isPending, quickCheck.isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setResult(null);
    try {
      const data = await quickCheck.mutateAsync({ keyword });
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStepStatus = (stepIndex: number): "pending" | "completed" | "running" | "failed" => {
    if (currentStep === 0) return "pending";
    if (currentStep > stepIndex) return "completed";
    if (currentStep === stepIndex) return "running";
    return "pending";
  };

  const pipelineSteps = [
    { name: "🔍 Identifiziere Marke & Kategorie...", status: getStepStatus(1) },
    { name: "🌐 Scanne Web & Konkurrenz (Perplexity AI)...", status: getStepStatus(2) },
    { name: "⚡ Berechne Resell-Score & Profit...", status: getStepStatus(3) },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sourcing Pipeline</h1>
        <p className="text-muted-foreground mt-2">
          Lohnt sich der Kauf? Lass die KI den aktuellen Markt scannen.
        </p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="z.B. Nike Jacke XL Vintage"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-12 h-14 text-lg bg-background"
              />
            </div>
            <Button type="submit" size="lg" disabled={quickCheck.isPending} className="h-14 px-8 text-lg font-semibold">
              {quickCheck.isPending ? "Analysiere..." : "Check"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {(quickCheck.isPending || (quickCheck.isSuccess && result)) && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PipelineProgress steps={pipelineSteps} />
        </div>
      )}

      {quickCheck.isError && (
        <Card className="border-destructive bg-destructive/5 mt-6">
          <CardContent className="p-6 text-destructive flex items-center gap-3">
            <span className="text-xl">⚠️</span> Es gab einen Fehler bei der Analyse. Bitte versuche es noch einmal.
          </CardContent>
        </Card>
      )}

      {result && currentStep === 4 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">
          <SourcingResultCard result={result} />
        </div>
      )}
    </div>
  );
}
