import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemStatusBadge } from "./ItemStatusBadge";
import type { Item } from "@/types";

interface Props { item: Item | null; onClose: () => void; }

export function ItemDetailSlideOver({ item, onClose }: Props) {
  if (!item) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md overflow-y-auto border-l bg-card shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-2">
            <ItemStatusBadge status={item.status} />
            {item.platform && <span className="text-sm text-muted-foreground">{item.platform}</span>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-xs text-muted-foreground">Marke</p><p className="text-sm font-medium">{item.brand}</p></div>
            <div><p className="text-xs text-muted-foreground">Zustand</p><p className="text-sm font-medium">{item.condition}</p></div>
            <div><p className="text-xs text-muted-foreground">EK-Preis</p><p className="text-sm font-medium">{Number(item.purchase_price_ek).toFixed(2)} EUR</p></div>
            <div><p className="text-xs text-muted-foreground">Zielpreis</p><p className="text-sm font-medium">{item.target_price ? `${Number(item.target_price).toFixed(2)} EUR` : "-"}</p></div>
            {item.size && <div><p className="text-xs text-muted-foreground">Groesse</p><p className="text-sm font-medium">{item.size}</p></div>}
            {item.color && <div><p className="text-xs text-muted-foreground">Farbe</p><p className="text-sm font-medium">{item.color}</p></div>}
          </div>
          {item.notes && (
            <div><p className="text-xs text-muted-foreground">Notizen</p><p className="mt-1 text-sm">{item.notes}</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
