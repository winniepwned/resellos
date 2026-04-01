import { Sparkles, ArrowRight, Image as ImageIcon, Tag, TrendingDown, History, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { differenceInDays } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  item: any;
}

export function AIBoosterCard({ item }: Props) {
  const [showHistory, setShowHistory] = useState(false);
  
  // Calculate days since listed
  const listedAt = item.listed_at ? new Date(item.listed_at) : new Date(item.created_at);
  const daysOnline = differenceInDays(new Date(), listedAt);
  
  // Simulated AI Diagnosis
  let phase = 0;
  if (daysOnline >= 7 && daysOnline < 14) phase = 1;
  else if (daysOnline >= 14 && daysOnline < 21) phase = 2;
  else if (daysOnline >= 21) phase = 3;

  const currentPrice = Number(item.target_price || item.purchase_price_ek);
  const dropPrice = Math.floor(currentPrice * 0.95);

  if (phase === 0) {
    return (
      <div className="p-4 border border-green-500/20 bg-green-500/5 rounded-xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-bold text-sm text-green-600 dark:text-green-400">Alles im grünen Bereich</h4>
          <p className="text-xs text-muted-foreground mt-1">Das Listing ist noch frisch. Wir sammeln aktuell Daten zu den Impressionen. Lehne dich zurück!</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h4 className="font-bold text-sm text-primary">KI-Diagnose & Booster</h4>
        </div>

        {/* Dynamic Tip based on Phase  */}
        {phase === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Der Artikel kriegt wenig Zugriffe. <span className="text-muted-foreground">KI-Tipp: Dein Titel hat zu wenig Keywords.</span></p>
            <div className="p-3 bg-background rounded-lg border text-sm flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Neuer Vorschlag</p>
                <p className="font-bold">{item.title} Vintage Y2K Condition</p>
              </div>
              <Button size="sm" variant="secondary" className="h-8">Übernehmen</Button>
            </div>
          </div>
        )}

        {phase === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Das Listing liegt schon eine Weile. <span className="text-muted-foreground">KI-Tipp: Zeit für einen Preis-Drop (Push).</span></p>
            <div className="p-3 bg-background rounded-lg border text-sm flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Empfohlene Preissenkung (5%)</p>
                <div className="flex items-center gap-2">
                  <span className="line-through text-muted-foreground">{currentPrice}€</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <span className="font-bold text-destructive">{dropPrice}€</span>
                </div>
              </div>
              <Button size="sm" variant="destructive" className="h-8 shadow-sm">Preis auf {dropPrice}€ senken</Button>
            </div>
          </div>
        )}

        {phase >= 3 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Preis und Titel sind optimiert. <span className="text-muted-foreground">KI-Tipp: Das Hauptbild ist eventuell zu dunkel oder weckt nicht genug Vertrauen.</span></p>
            <div className="p-3 bg-background rounded-lg border text-sm flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center"><ImageIcon className="w-5 h-5 text-muted-foreground/50"/></div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Aktion erforderlich</p>
                  <p className="font-bold text-xs">Neues Tragebild hochladen</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="h-8">Bilder bearbeiten</Button>
            </div>
          </div>
        )}
      </div>

      {/* Expandable History */}
      <div className="border-t border-primary/10 bg-primary/[0.02]">
        <button 
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between p-3 text-xs font-medium text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-1.5"><History className="w-3.5 h-3.5"/> Bisherige KI-Maßnahmen ({(phase - 1)})</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", showHistory && "rotate-180")} />
        </button>
        {showHistory && (
          <div className="px-4 pb-4 pt-1 space-y-3">
            {phase >= 2 && (
              <div className="flex items-start gap-2 text-xs">
                <Tag className="w-3.5 h-3.5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Titel optimiert</p>
                  <p className="text-muted-foreground">Vor {daysOnline - 7} Tagen durchgeführt</p>
                </div>
              </div>
            )}
            {phase >= 3 && (
              <div className="flex items-start gap-2 text-xs">
                <TrendingDown className="w-3.5 h-3.5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Preis gepusht (-5%)</p>
                  <p className="text-muted-foreground">Vor {daysOnline - 14} Tagen durchgeführt</p>
                </div>
              </div>
            )}
            {phase < 2 && (
              <p className="text-xs text-muted-foreground italic">Noch keine Maßnahmen ergriffen.</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
