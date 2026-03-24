import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeadStock } from "@/hooks/useAnalytics";
import { AlertTriangle } from "lucide-react";

export function DeadStockList() {
  const { data } = useDeadStock();
  const items = (data?.items || []) as Array<{ item_id: string; title: string; brand: string; days_stagnating: number; purchase_price: number; ai_tip: string | null }>;

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-yellow-400" /> Dead-Stock</CardTitle></CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Keine stagnierenden Artikel.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.item_id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-destructive">{item.days_stagnating} Tage</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.brand} — {item.purchase_price.toFixed(2)} EUR EK</p>
                {item.ai_tip && <p className="mt-1 text-xs text-yellow-400">{item.ai_tip}</p>}
              </div>
            ))}
            {data?.total_capital_locked != null && (
              <p className="text-sm text-muted-foreground">Gebundenes Kapital: {data.total_capital_locked.toFixed(2)} EUR</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
