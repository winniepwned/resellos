import { Card, CardContent } from "@/components/ui/card";
import { ItemStatusBadge } from "./ItemStatusBadge";
import type { Item } from "@/types";

interface Props {
  item: Item;
  onClick: () => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  selectionMode?: boolean;
}

export function ItemCard({ item, onClick, isSelected, onToggleSelect, selectionMode }: Props) {
  return (
    <Card
      className={`relative cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent/40'}`}
      onClick={onClick}
    >
      {selectionMode && onToggleSelect && (
        <div
          className="absolute top-3 left-3 z-10"
          onClick={(e) => { e.stopPropagation(); onToggleSelect(item.id); }}
        >
          <input
            type="checkbox"
            className="w-[18px] h-[18px] rounded-md border-muted-foreground/30 bg-background/80 backdrop-blur-sm accent-primary cursor-pointer transition-all hover:scale-110 shadow-sm"
            checked={!!isSelected}
            onChange={() => {}}
          />
        </div>
      )}
      <CardContent className="p-4">
        {item.images && item.images.length > 0 && (
          <div className="mb-3 aspect-square overflow-hidden rounded-md bg-muted">
            <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="space-y-1">
          <h3 className={`font-medium leading-tight ${isSelected && 'text-primary'}`}>{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.brand}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold">{Number(item.purchase_price_ek).toFixed(2)} EUR</span>
            <ItemStatusBadge status={item.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
