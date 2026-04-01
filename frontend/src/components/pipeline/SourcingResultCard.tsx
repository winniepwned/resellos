import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResellScoreGauge } from "@/components/insights/ResellScoreGauge";
import type { SourcingResult } from "@/types";
import { TrendingUp, Tags, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { result: SourcingResult; }

export function SourcingResultCard({ result }: Props) {
  const isBuy = result.recommendation === "buy";
  const isRisky = result.recommendation === "risky";
  
  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-xl bg-card/80 backdrop-blur">
      <div className="bg-accent/40 px-6 py-4 flex items-center justify-between border-b">
        <div>
          <h3 className="font-bold text-xl">{result.detected_brand || "Marke"}</h3>
          <p className="text-sm text-muted-foreground">{result.detected_category}</p>
        </div>
        <Badge 
          variant={isBuy ? "default" : isRisky ? "secondary" : "destructive"} 
          className={`text-sm px-4 py-1.5 font-bold tracking-wide ${isBuy ? 'bg-score-green text-white hover:bg-score-green' : isRisky ? 'bg-score-yellow text-amber-900 border-transparent hover:bg-score-yellow' : 'bg-score-red text-white hover:bg-score-red'}`}
        >
          {isBuy ? "✅ KAUFEMPFEHLUNG" : isRisky ? "⚠️ RISKANT" : "❌ FINGER WEG"}
        </Badge>
      </div>

      <CardContent className="p-8 grid gap-8 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center p-6 bg-background rounded-2xl border shadow-inner">
          <ResellScoreGauge score={result.resell_score || 0} size="lg" />
          <p className="mt-8 text-sm text-center text-muted-foreground leading-relaxed">
            {result.market_reasoning}
          </p>
        </div>

        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground tracking-wider uppercase">
              <TrendingUp className="h-4 w-4" /> Geschätzter Netto-Profit
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600">
                {Number(result.estimated_profit_low).toFixed(2)}€ - {Number(result.estimated_profit_high).toFixed(2)}€
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Nach Abzug aller Gebühren & Standard-EK.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground tracking-wider uppercase">
              <Tags className="h-4 w-4" /> Nächste Schritte
            </h4>
            <div className="flex flex-col gap-3">
              <Button className="w-full text-md h-12 flex justify-between px-6" variant={isBuy ? "default" : "outline"}>
                <span>Ins Inventar übernehmen</span>
                <CheckCircle2 className="h-5 w-5 opacity-70" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
