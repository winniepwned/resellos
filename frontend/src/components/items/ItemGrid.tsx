import type { Item } from "@/types";
import { ItemCard } from "./ItemCard";

interface Props {
  items: Item[];
  onSelect: (item: Item) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  selectionMode: boolean;
}

export function ItemGrid({ items, onSelect, selectedIds, onToggleSelect, selectionMode }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onClick={() => onSelect(item)}
          isSelected={selectedIds.has(item.id)}
          onToggleSelect={onToggleSelect}
          selectionMode={selectionMode}
        />
      ))}
    </div>
  );
}
