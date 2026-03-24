import { Card, CardContent } from "@/components/ui/card";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";

export function FinancialOverview() {
  const { data, isLoading } = useAnalyticsOverview();
  if (isLoading) return <SkeletonLoader rows={1} />;
  if (!data) return null;

  const metrics = [
    { label: "Profit", value: `${Number(data.total_profit).toFixed(2)} EUR`, color: "text-green-400" },
    { label: "Umsatz", value: `${Number(data.total_revenue).toFixed(2)} EUR` },
    { label: "ROI", value: `${Number(data.roi_percent).toFixed(1)}%`, color: "text-primary" },
    { label: "Avg. Profit", value: `${Number(data.avg_profit_per_item).toFixed(2)} EUR` },
    { label: "Verkauft", value: String(data.items_sold) },
    { label: "Aktiv", value: String(data.items_active) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map((m) => (
        <Card key={m.label}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className={`mt-1 text-lg font-bold ${m.color || ""}`}>{m.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
