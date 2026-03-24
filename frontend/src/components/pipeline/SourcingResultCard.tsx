import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResellScoreGauge } from "@/components/insights/ResellScoreGauge";
import { Badge } from "@/components/ui/badge";
import type { SourcingResult } from "@/types";

interface Props { result: SourcingResult; }

export function SourcingResultCard({ result }: Props) {
  const recColors: Record<string, string> = { buy: "bg-green-500/20 text-green-400", skip: "bg-red-500/20 text-red-400", risky: "bg-yellow-500/20 text-yellow-400" };

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Sourcing-Ergebnis</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          {result.resell_score && <ResellScoreGauge score={result.resell_score} />}
          <div className="space-y-1">
            {result.detected_brand && <p className="text-sm"><span className="text-muted-foreground">Marke:</span> {result.detected_brand}</p>}
            {result.detected_category && <p className="text-sm"><span className="text-muted-foreground">Kategorie:</span> {result.detected_category}</p>}
            {result.recommendation && <Badge className={`border-0 ${recColors[result.recommendation] || ""}`}>{result.recommendation.toUpperCase()}</Badge>}
          </div>
        </div>
        {result.estimated_profit_low != null && result.estimated_profit_high != null && (
          <p className="text-sm text-muted-foreground">Geschaetzter Profit: {result.estimated_profit_low.toFixed(2)} - {result.estimated_profit_high.toFixed(2)} EUR</p>
        )}
        {result.market_reasoning && <p className="text-sm text-muted-foreground">{result.market_reasoning}</p>}
      </CardContent>
    </Card>
  );
}
