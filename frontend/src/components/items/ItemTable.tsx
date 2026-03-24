import type { Item } from "@/types";
import { ItemStatusBadge } from "./ItemStatusBadge";

interface Props {
  items: Item[];
  onSelect: (item: Item) => void;
}

export function ItemTable({ items, onSelect }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Titel</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Marke</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">EK</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plattform</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} onClick={() => onSelect(item)} className="border-b cursor-pointer hover:bg-accent/50 transition-colors">
              <td className="px-4 py-3 font-medium">{item.title}</td>
              <td className="px-4 py-3 text-muted-foreground">{item.brand}</td>
              <td className="px-4 py-3">{item.purchase_price_ek.toFixed(2)} EUR</td>
              <td className="px-4 py-3"><ItemStatusBadge status={item.status} /></td>
              <td className="px-4 py-3 text-muted-foreground">{item.platform || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
