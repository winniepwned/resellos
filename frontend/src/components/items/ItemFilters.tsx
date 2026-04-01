import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useItemsStore } from "@/stores/items.store";
import { LayoutGrid, List } from "lucide-react";

export function ItemFilters() {
  const { viewMode, searchQuery, setViewMode, setSearchQuery } = useItemsStore();

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      <Input placeholder="Suchen (Titel, Marke, SKU)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full max-w-sm" />
      <div className="ml-auto flex gap-1">
        <Button variant={viewMode === "table" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("table")}><List className="h-4 w-4" /></Button>
        <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}><LayoutGrid className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
