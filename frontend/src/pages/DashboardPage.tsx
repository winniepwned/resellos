import { FinancialOverview } from "@/components/analytics/FinancialOverview";
import { InventoryHealth } from "@/components/analytics/InventoryHealth";
import { BrandPerformance } from "@/components/analytics/BrandPerformance";
import { SellThroughRate } from "@/components/analytics/SellThroughRate";
import { DeadStockList } from "@/components/analytics/DeadStockList";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <FinancialOverview />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InventoryHealth />
        <div className="space-y-6">
          <SellThroughRate />
          <BrandPerformance />
        </div>
      </div>
      <DeadStockList />
    </div>
  );
}
