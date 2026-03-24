import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryHealth } from "@/hooks/useAnalytics";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";

export function InventoryHealth() {
  const { data, isLoading } = useInventoryHealth();
  if (isLoading) return <SkeletonLoader rows={2} />;
  if (!data) return null;

  return (
    <Card>
      <CardHeader><CardTitle>The Vault</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div><p className="text-xs text-muted-foreground">Artikel</p><p className="text-xl font-bold">{data.total_items}</p></div>
          <div><p className="text-xs text-muted-foreground">Investiert</p><p className="text-xl font-bold">{data.total_capital_invested.toFixed(2)} EUR</p></div>
          <div><p className="text-xs text-muted-foreground">Erw. Umsatz</p><p className="text-xl font-bold text-primary">{data.expected_revenue.toFixed(2)} EUR</p></div>
          <div><p className="text-xs text-muted-foreground">Erw. Profit</p><p className="text-xl font-bold text-green-400">{data.expected_profit.toFixed(2)} EUR</p></div>
        </div>
      </CardContent>
    </Card>
  );
}
