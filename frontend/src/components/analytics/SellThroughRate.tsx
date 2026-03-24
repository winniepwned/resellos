import { Card, CardContent } from "@/components/ui/card";
import { useSellThroughRate } from "@/hooks/useAnalytics";

export function SellThroughRate() {
  const { data } = useSellThroughRate();
  if (!data) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">Sell-Through Rate</p>
        <p className="mt-1 text-2xl font-bold text-primary">{data.rate_percent.toFixed(1)}%</p>
        <p className="text-xs text-muted-foreground">{data.items_sold} von {data.items_listed} gelistet</p>
      </CardContent>
    </Card>
  );
}
