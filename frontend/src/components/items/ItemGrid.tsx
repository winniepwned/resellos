import type { Item } from "@/types";
import { ItemCard } from "./ItemCard";

interface Props {
  items: Item[];
  onSelect: (item: Item) => void;
}

export function ItemGrid({ items, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onClick={() => onSelect(item)} />
      ))}
    </div>
  );
}
