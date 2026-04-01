import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ItemTable } from "@/components/items/ItemTable";
import { ItemGrid } from "@/components/items/ItemGrid";
import { ItemFilters } from "@/components/items/ItemFilters";
import { ItemForm } from "@/components/items/ItemForm";
import { ItemDetailSlideOver } from "@/components/items/ItemDetailSlideOver";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { useItems, useUpdateItem, useDeleteItem } from "@/hooks/useItems";
import { useItemsStore } from "@/stores/items.store";
import { Plus, Archive, Trash2, X, CheckSquare } from "lucide-react";
import type { Item } from "@/types";

export function InventoryPage() {
  const { viewMode, statusFilter, searchQuery, setStatusFilter } = useItemsStore();
  const { data, isLoading } = useItems();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Selection mode: checkboxes only visible when active
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const items = (data?.items || []).filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !item.title.toLowerCase().includes(q) &&
        !item.brand.toLowerCase().includes(q) &&
        !item.sku?.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (statusFilter === "draft") {
      return ["draft", "analyzing", "ready"].includes(item.status);
    }
    if (statusFilter && ["listed", "sold", "archived"].includes(statusFilter)) {
      return item.status === statusFilter;
    }
    return true;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const handleExitSelection = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleBulkArchive = async () => {
    if (!window.confirm(`${selectedIds.size} Artikel archivieren?`)) return;
    for (const id of selectedIds) {
      await updateItem.mutateAsync({ id, status: "archived" });
    }
    handleExitSelection();
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`${selectedIds.size} Artikel endgültig löschen?`)) return;
    for (const id of selectedIds) {
      await deleteItem.mutateAsync(id);
    }
    handleExitSelection();
  };

  return (
    <div className="space-y-4 pb-20 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventar</h1>
        <div className="flex items-center gap-2">
          {!selectionMode ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectionMode(true)}
              className="text-muted-foreground"
            >
              <CheckSquare className="mr-2 h-4 w-4" /> Auswählen
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExitSelection}
              className="text-muted-foreground"
            >
              <X className="mr-2 h-4 w-4" /> Auswahl beenden
            </Button>
          )}
          <Button onClick={() => setShowForm(true)} className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Neuer Artikel
          </Button>
        </div>
      </div>

      <ItemFilters />

      {isLoading ? (
        <SkeletonLoader rows={5} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Keine Artikel gefunden"
          description="Erstelle deinen ersten Artikel oder ändere den Filter."
          action={<Button onClick={() => setShowForm(true)}>Artikel erstellen</Button>}
        />
      ) : viewMode === "table" ? (
        <ItemTable
          items={items}
          onSelect={setSelectedItem}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          selectionMode={selectionMode}
        />
      ) : (
        <ItemGrid
          items={items}
          onSelect={setSelectedItem}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          selectionMode={selectionMode}
        />
      )}

      {/* Floating Bulk Action Bar */}
      {selectionMode && selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-4 px-6 py-3 bg-foreground/95 text-background backdrop-blur-3xl rounded-full shadow-2xl shadow-black/20 dark:shadow-white/5 border border-white/10">
            <div className="flex items-center gap-2 border-r border-white/20 pr-4">
              <span className="flex items-center justify-center p-1 bg-white/20 rounded-md text-xs font-bold min-w-6">{selectedIds.size}</span>
              <span className="text-sm font-medium opacity-90">ausgewählt</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="hover:bg-white/10 hover:text-white" onClick={handleBulkArchive} disabled={updateItem.isPending}>
                <Archive className="w-4 h-4 mr-1.5"/> Archivieren
              </Button>
              <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={handleBulkDelete} disabled={deleteItem.isPending}>
                <Trash2 className="w-4 h-4 mr-1.5"/> Löschen
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full ml-1 hover:bg-white/10 text-white/70" onClick={handleExitSelection}>
                <X className="w-4 h-4"/>
              </Button>
            </div>
          </div>
        </div>
      )}

      <ItemDetailSlideOver item={selectedItem} onClose={() => setSelectedItem(null)} />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="mb-4 text-lg font-bold">Neuer Artikel</h2>
            <ItemForm
              onClose={() => setShowForm(false)}
              onSuccess={() => setStatusFilter("draft")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
