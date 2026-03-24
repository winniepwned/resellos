import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBrandPerformance } from "@/hooks/useAnalytics";

export function BrandPerformance() {
  const { data } = useBrandPerformance();
  const brands = (data?.brands || []) as Array<{ brand: string; items_count: number; total_profit: number }>;

  return (
    <Card>
      <CardHeader><CardTitle>Brand Performance</CardTitle></CardHeader>
      <CardContent>
        {brands.length === 0 ? (
          <p className="text-sm text-muted-foreground">Noch keine Daten.</p>
        ) : (
          <div className="space-y-2">
            {brands.slice(0, 10).map((b) => (
              <div key={b.brand} className="flex items-center justify-between">
                <span className="text-sm">{b.brand} ({b.items_count})</span>
                <span className="text-sm font-medium text-green-400">{Number(b.total_profit).toFixed(2)} EUR</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
