import { X, Box, Tag, Trophy, TrendingUp, Clock, Store, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Item } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  item: Item;
  onClose: () => void;
}

const PLATFORM_FEES: Record<string, number> = {
  vinted: 0.05,
  ebay: 0.11,
  kleinanzeigen: 0.0,
};

function getPlatformFee(platform: string | null): number {
  if (!platform) return 0;
  return PLATFORM_FEES[platform.toLowerCase()] ?? 0;
}

function calcNetProfit(item: Item): number {
  const soldPrice = Number(item.sold_price ?? 0);
  const ek = Number(item.purchase_price_ek);
  const fee = getPlatformFee(item.platform);
  return soldPrice - ek - soldPrice * fee;
}

function calcROI(item: Item): number {
  const ek = Number(item.purchase_price_ek);
  if (ek === 0) return 0;
  return (calcNetProfit(item) / ek) * 100;
}

function calcDaysOnMarket(item: Item): number | null {
  if (!item.created_at || !item.sold_at) return null;
  const created = new Date(item.created_at).getTime();
  const sold = new Date(item.sold_at).getTime();
  return Math.max(0, Math.floor((sold - created) / (1000 * 60 * 60 * 24)));
}

export function SoldItemDetail({ item, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const netProfit = calcNetProfit(item);
  const roi = calcROI(item);
  const daysOnMarket = calcDaysOnMarket(item);
  const soldPrice = Number(item.sold_price ?? 0);
  const ek = Number(item.purchase_price_ek);
  const feeRate = getPlatformFee(item.platform);
  const feeAmount = soldPrice * feeRate;

  const handleCopyMessage = async () => {
    const message = `Hi! Danke für deinen Kauf der ${item.title}. Das Paket ist schon gepackt und geht morgen raus! Liebe Grüße.`;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = message;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] lg:w-[540px] border-l bg-background shadow-2xl transition-transform duration-300 ease-out flex flex-col translate-x-0">
      {/* Header */}
      <div className="flex flex-col border-b bg-muted/20 sticky top-0 z-10 backdrop-blur-3xl">
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div className="flex flex-col gap-1.5 overflow-hidden pr-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-green-500 shrink-0" />
              <h2 className="text-xl font-bold tracking-tight truncate">{item.title}</h2>
              <Badge className="bg-green-500/15 text-green-500 border-green-500/25 shrink-0">
                Verkauft
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {item.brand || "Unbekannt"} &middot; {item.condition} &middot; Gr. {item.size || "-"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 shrink-0"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 md:px-8 md:py-6 space-y-6 flex-1 overflow-y-auto">

        {/* Fulfillment Box */}
        <Card className="border-2 border-primary/30 bg-zinc-900/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/20">
                  <Box className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lagerplatz</p>
                  <p className="text-base font-bold text-foreground">
                    {item.storage_location || "Nicht zugewiesen"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                <span className="text-sm font-mono font-semibold">
                  #{item.sku || "ITM-???"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics - Two green cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-zinc-900/80 border-green-500/20">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Netto-Gewinn
              </p>
              <p className={cn(
                "text-2xl font-black",
                netProfit >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {netProfit >= 0 ? "+" : ""}{netProfit.toFixed(2)} &euro;
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/80 border-green-500/20">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                ROI
              </p>
              <p className={cn(
                "text-2xl font-black",
                roi >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {roi >= 0 ? "+" : ""}{roi.toFixed(0)} %
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
            Performance
          </h3>

          {/* Time on Market */}
          {daysOnMarket !== null && (
            <Card className="bg-zinc-900/60 border-border/40">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Verkauft in {daysOnMarket} {daysOnMarket === 1 ? "Tag" : "Tagen"}
                  </p>
                  <p className="text-xs text-muted-foreground">Time on Market</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Platform Insight */}
          <Card className="bg-zinc-900/60 border-border/40">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Store className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground capitalize">
                  Verkauft auf {item.platform || "Unbekannt"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {feeRate > 0
                    ? `Plattformgebühr: ${(feeRate * 100).toFixed(0)}%`
                    : "Keine Plattformgebühr"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Price Info */}
          <Card className="bg-zinc-900/60 border-border/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-sm font-semibold text-foreground">Preisübersicht</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">EK</p>
                  <p className="text-sm font-bold text-red-400">{ek.toFixed(2)} &euro;</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">VK</p>
                  <p className="text-sm font-bold text-green-400">{soldPrice.toFixed(2)} &euro;</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Gebühren</p>
                  <p className="text-sm font-bold text-orange-400">{feeAmount.toFixed(2)} &euro;</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Buyer Message */}
        <div className="pt-2">
          <Button
            variant="outline"
            className={cn(
              "w-full py-5 font-semibold transition-all duration-300",
              copied
                ? "border-green-500/40 bg-green-500/10 text-green-500"
                : "border-border/60 hover:border-primary/40 hover:bg-muted/40"
            )}
            onClick={handleCopyMessage}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Kopiert!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Nachricht an Käufer kopieren
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
