import type { Item } from "@/types";
import { ItemStatusBadge } from "./ItemStatusBadge";
import { Box } from "lucide-react";

interface Props {
  items: Item[];
  onSelect: (item: Item) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  selectionMode: boolean;
}

export function ItemTable({ items, onSelect, selectedIds, onToggleSelect, onSelectAll, selectionMode }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {selectionMode && (
              <th className="px-4 py-3 w-12 text-center border-r">
                <input
                  type="checkbox"
                  className="w-[18px] h-[18px] rounded-md border-muted-foreground/30 accent-primary cursor-pointer transition-all hover:scale-105"
                  checked={items.length > 0 && selectedIds.size === items.length}
                  onChange={onSelectAll}
                />
              </th>
            )}
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Titel & SKU</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Marke</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Lagerplatz</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">EK</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plattform</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <tr
                key={item.id}
                className={`border-b cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-accent/50'}`}
                onClick={() => onSelect(item)}
              >
                {selectionMode && (
                  <td className="px-4 py-3 border-r text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] rounded-md border-muted-foreground/30 accent-primary cursor-pointer transition-all hover:scale-105"
                      checked={isSelected}
                      onChange={() => onToggleSelect(item.id)}
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>{item.title}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">
                    {item.sku || "#ITM-NEU"}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.brand}</td>
                <td className="px-4 py-3 text-muted-foreground font-medium">
                  {item.storage_location ? (
                    <span className="flex items-center gap-1.5"><Box className="w-3.5 h-3.5"/> {item.storage_location}</span>
                  ) : <span className="opacity-50">-</span>}
                </td>
                <td className="px-4 py-3">{Number(item.purchase_price_ek).toFixed(2)} EUR</td>
                <td className="px-4 py-3"><ItemStatusBadge status={item.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{item.platform || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
