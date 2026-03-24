import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ItemTable } from "@/components/items/ItemTable";
import { ItemGrid } from "@/components/items/ItemGrid";
import { ItemFilters } from "@/components/items/ItemFilters";
import { ItemForm } from "@/components/items/ItemForm";
import { ItemDetailSlideOver } from "@/components/items/ItemDetailSlideOver";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { useItems } from "@/hooks/useItems";
import { useItemsStore } from "@/stores/items.store";
import { Plus } from "lucide-react";
import type { Item } from "@/types";

export function InventoryPage() {
  const { viewMode, statusFilter, searchQuery } = useItemsStore();
  const { data, isLoading } = useItems(statusFilter || undefined);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const items = (data?.items || []).filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventar</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Neuer Artikel
        </Button>
      </div>

      <ItemFilters />

      {isLoading ? (
        <SkeletonLoader rows={5} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Keine Artikel"
          description="Erstelle deinen ersten Artikel um loszulegen."
          action={<Button onClick={() => setShowForm(true)}>Artikel erstellen</Button>}
        />
      ) : viewMode === "table" ? (
        <ItemTable items={items} onSelect={setSelectedItem} />
      ) : (
        <ItemGrid items={items} onSelect={setSelectedItem} />
      )}

      <ItemDetailSlideOver item={selectedItem} onClose={() => setSelectedItem(null)} />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-lg rounded-lg border bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Neuer Artikel</h2>
            <ItemForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
