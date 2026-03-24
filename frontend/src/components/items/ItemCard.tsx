import { Card, CardContent } from "@/components/ui/card";
import { ItemStatusBadge } from "./ItemStatusBadge";
import type { Item } from "@/types";

interface Props { item: Item; onClick: () => void; }

export function ItemCard({ item, onClick }: Props) {
  return (
    <Card className="cursor-pointer transition-colors hover:bg-accent/30" onClick={onClick}>
      <CardContent className="p-4">
        {item.images.length > 0 && (
          <div className="mb-3 aspect-square overflow-hidden rounded-md bg-muted">
            <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="space-y-1">
          <h3 className="font-medium leading-tight">{item.title}</h3>
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
