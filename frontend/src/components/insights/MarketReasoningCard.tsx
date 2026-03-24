import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { reasoning: string | null; competitorCount: number | null; demandLevel: string | null; }

export function MarketReasoningCard({ reasoning, competitorCount, demandLevel }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Marktanalyse</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {reasoning && <p className="text-sm">{reasoning}</p>}
        <div className="flex gap-4 text-sm text-muted-foreground">
          {competitorCount != null && <span>Konkurrenz: {competitorCount} Listings</span>}
          {demandLevel && <span>Nachfrage: {demandLevel}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
