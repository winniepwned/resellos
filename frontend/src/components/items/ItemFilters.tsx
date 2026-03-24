import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useItemsStore } from "@/stores/items.store";
import { LayoutGrid, List } from "lucide-react";


const statuses = [
  { value: null, label: "Alle" },
  { value: "draft", label: "Entwurf" },
  { value: "analyzing", label: "Analyse" },
  { value: "ready", label: "Bereit" },
  { value: "listed", label: "Gelistet" },
  { value: "sold", label: "Verkauft" },
];

export function ItemFilters() {
  const { viewMode, statusFilter, searchQuery, setViewMode, setStatusFilter, setSearchQuery } = useItemsStore();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input placeholder="Suche..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48" />
      <div className="flex gap-1">
        {statuses.map((s) => (
          <Button key={s.label} variant={statusFilter === s.value ? "default" : "ghost"} size="sm" onClick={() => setStatusFilter(s.value)}>
            {s.label}
          </Button>
        ))}
      </div>
      <div className="ml-auto flex gap-1">
        <Button variant={viewMode === "table" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("table")}><List className="h-4 w-4" /></Button>
        <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}><LayoutGrid className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
