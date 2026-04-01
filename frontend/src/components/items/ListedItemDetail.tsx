import {
  X,
  Clock,
  DollarSign,
  Archive,
  ChevronDown,
  ChevronUp,
  Box,
  Tag,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Item } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  item: Item;
  onClose: () => void;
  onMarkSold: (data: { sold_price: number }) => void;
  onArchive: () => void;
}

export function ListedItemDetail({ item, onClose, onMarkSold, onArchive }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [showSoldForm, setShowSoldForm] = useState(false);
  const [soldPrice, setSoldPrice] = useState(
    (item.target_price || item.purchase_price_ek).toString()
  );

  // --- Helpers ---

  const getDaysOnline = () => {
    if (!item.listed_at) return 0;
    const diffTime = Math.abs(new Date().getTime() - new Date(item.listed_at).getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysOnline = getDaysOnline();

  const getBoosterPhase = () => {
    if (daysOnline >= 21) return 3;
    if (daysOnline >= 14) return 2;
    if (daysOnline >= 7) return 1;
    return 0;
  };

  const phase = getBoosterPhase();

  const listingPrice = Number(item.target_price || item.purchase_price_ek);

  const parseNotes = () => {
    try {
      return JSON.parse(item.notes || "{}");
    } catch {
      return {};
    }
  };

  const notesData = parseNotes();
  const sku = item.sku || notesData.sku || null;
  const storageLocation = item.storage_location || notesData.storage_location || null;

  const handleMarkSold = () => {
    const price = Number(soldPrice);
    if (!price || price <= 0) return;
    onMarkSold({ sold_price: price });
  };

  // --- Render ---

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      {/* Header */}
      <div className="flex flex-col border-b border-zinc-800 bg-zinc-900/80 sticky top-0 z-10 backdrop-blur-xl">
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div className="flex flex-col gap-2 pr-4 min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 leading-tight">
              {item.title}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="border-0 bg-yellow-500/20 text-yellow-400">Gelistet</Badge>
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Clock className="w-3 h-3" />
                {daysOnline} {daysOnline === 1 ? "Tag" : "Tage"} online
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 shrink-0 mt-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Live Status Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-zinc-900 border border-blue-500/20">
          <p className="text-xs font-semibold text-blue-400/80 uppercase tracking-wider mb-1">
            Live Status
          </p>
          <p className="text-2xl font-black text-zinc-100">
            Aktuell gelistet f&uuml;r{" "}
            <span className="text-blue-400">{listingPrice.toFixed(2)}&euro;</span>
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300">
              <Globe className="w-4 h-4 text-zinc-500" />
              {item.platform || "Unbekannt"}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-sm text-zinc-400">
              Seit {daysOnline} {daysOnline === 1 ? "Tag" : "Tagen"} online
            </span>
          </div>
        </div>

        {/* AI Booster Tips */}
        {phase === 0 && (
          <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-green-400">Alles im gr&uuml;nen Bereich</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Das Listing ist noch frisch. Wir sammeln aktuell Daten zu den Impressionen.
              </p>
            </div>
          </div>
        )}

        {phase === 1 && (
          <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex items-start gap-3">
            <Tag className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-yellow-400">Titel-Optimierung empfohlen</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Der Artikel bekommt wenig Zugriffe. Versuche mehr Keywords im Titel unterzubringen.
              </p>
            </div>
          </div>
        )}

        {phase === 2 && (
          <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-orange-400">Preis-Anpassung vorschlagen</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Das Listing liegt schon eine Weile. Eine Preissenkung von 5% k&ouml;nnte einen Push ausl&ouml;sen.
              </p>
            </div>
          </div>
        )}

        {phase === 3 && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-red-400">Fotos auffrischen oder Preis senken</h4>
              <p className="text-xs text-zinc-400 mt-1">
                {daysOnline}+ Tage online ohne Verkauf. &Uuml;berpr&uuml;fe Bilder, Preis und Beschreibung.
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3 pt-2">
          {!showSoldForm ? (
            <Button
              onClick={() => setShowSoldForm(true)}
              className="w-full text-lg py-7 font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all shadow-green-500/20 bg-green-500 hover:bg-green-600 text-white"
            >
              <DollarSign className="w-6 h-6" />
              Als &apos;Verkauft&apos; markieren
            </Button>
          ) : (
            <div className="p-5 border-2 border-green-500/30 bg-green-500/5 rounded-2xl space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <h4 className="font-bold flex items-center gap-2 text-green-500">
                <DollarSign className="w-5 h-5" /> Verkauf abschlie&szlig;en
              </h4>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase">
                  Verkaufspreis (&euro;)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={soldPrice}
                  onChange={(e) => setSoldPrice(e.target.value)}
                  className="font-bold h-10 bg-zinc-800 border-zinc-700"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  className="w-1/3 border-zinc-700 hover:bg-zinc-800"
                  onClick={() => setShowSoldForm(false)}
                >
                  Abbrechen
                </Button>
                <Button
                  className="w-2/3 shadow-md bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleMarkSold}
                >
                  Verkauf abschlie&szlig;en
                </Button>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full flex items-center gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={onArchive}
          >
            <Archive className="w-4 h-4" />
            Archivieren
          </Button>
        </div>

        {/* Item Details (Collapsible) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className={cn(
              "w-full flex items-center gap-2 text-sm font-semibold text-zinc-400 p-3 rounded-lg transition-colors border border-zinc-800",
              showDetails ? "bg-zinc-800/60" : "bg-zinc-800/30 hover:bg-zinc-800/50"
            )}
          >
            {showDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            Artikeldetails anzeigen
          </button>

          {showDetails && (
            <div className="mt-3 space-y-4 animate-in fade-in duration-300">
              {/* Detail Grid */}
              <div className="grid grid-cols-2 gap-3">
                <DetailField label="Marke" value={item.brand || "-"} />
                <DetailField label="Kategorie" value={item.category || "-"} />
                <DetailField label="Gr&ouml;&szlig;e" value={item.size || "-"} />
                <DetailField label="Zustand" value={item.condition || "-"} />
                <DetailField label="Farbe" value={item.color || "-"} />
                <DetailField
                  label="EK Preis"
                  value={`${Number(item.purchase_price_ek).toFixed(2)}\u20AC`}
                  highlight
                />
                {storageLocation && (
                  <DetailField
                    label="Lagerplatz"
                    value={storageLocation}
                    icon={<Box className="w-3.5 h-3.5 text-zinc-500" />}
                  />
                )}
                {sku && (
                  <DetailField
                    label="SKU"
                    value={sku}
                    icon={<Tag className="w-3.5 h-3.5 text-zinc-500" />}
                  />
                )}
              </div>

              {/* Images */}
              {item.images && item.images.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Bilder
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {item.images.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`${item.title} ${idx + 1}`}
                        className="w-20 h-20 rounded-lg object-cover border border-zinc-700 shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function DetailField({
  label,
  value,
  highlight,
  icon,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-800">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <p
        className={cn(
          "text-sm font-medium flex items-center gap-1.5",
          highlight ? "text-red-400" : "text-zinc-200"
        )}
      >
        {icon}
        {value}
      </p>
    </div>
  );
}
