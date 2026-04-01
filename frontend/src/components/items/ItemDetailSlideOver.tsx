import { X, Sparkles, Trash2, Box, Tag, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemStatusBadge } from "./ItemStatusBadge";
import { PipelineProgress } from "@/components/pipeline/PipelineProgress";
import { ReadyToListCard } from "./ReadyToListCard";
import { SoldItemDetail } from "./SoldItemDetail";
import { ListedItemDetail } from "./ListedItemDetail";
import { useItemInsights, useGenerateInsights } from "@/hooks/useItemInsights";
import { useUpdateItem, useDeleteItem, useMarkListed, useMarkSold } from "@/hooks/useItems";
import type { Item } from "@/types";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface Props { item: Item | null; onClose: () => void; }

export function ItemDetailSlideOver({ item, onClose }: Props) {
  const { data: insights } = useItemInsights(item?.id ?? null);
  const generateInsights = useGenerateInsights();
  const [pipelineStep, setPipelineStep] = useState(0);
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const markListed = useMarkListed();
  const markSold = useMarkSold();
  const { width, height } = useWindowSize();

  const [showConfetti, setShowConfetti] = useState(false);

  // Use a ref to prevent double-firing in strict mode
  const hasTriggeredRef = useRef<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (generateInsights.isPending) {
      setPipelineStep(1);
      interval = setInterval(() => {
        setPipelineStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 1500);
    } else if (generateInsights.isSuccess || insights) {
      setPipelineStep(4);
    } else {
      setPipelineStep(0);
    }
    return () => clearInterval(interval);
  }, [generateInsights.isPending, generateInsights.isSuccess, insights]);

  // Get active item (or keep previous item for exit animation)
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  useEffect(() => {
    if (item) {
      setActiveItem(item);
    }
  }, [item]);

  // Auto-Run Pipeline for drafts
  useEffect(() => {
    if (
      activeItem &&
      (!insights && !generateInsights.isPending && !generateInsights.isSuccess) &&
      ["draft", "analyzing", "ready"].includes(activeItem.status)
    ) {
      if (hasTriggeredRef.current !== activeItem.id && activeItem.brand) {
        hasTriggeredRef.current = activeItem.id;
        handleGenerate(activeItem);
      }
    }
  }, [activeItem, insights, generateInsights.isPending, generateInsights.isSuccess]);

  const handleGenerate = (targetItem: Item) => {
    if (!targetItem?.id || !targetItem?.brand) return;
    updateItem.mutate({ id: targetItem.id, status: "analyzing" });
    generateInsights.mutate({ itemId: targetItem.id, brand: targetItem.brand, category: targetItem.category || "Fashion" }, {
      onSuccess: () => {
        updateItem.mutate({ id: targetItem.id, status: "ready" });
      }
    });
  };

  const handlePublish = async (platform: string, price: number) => {
    if (!item?.id) return;
    try {
      await updateItem.mutateAsync({ id: item.id, target_price: price, platform: platform });
      await markListed.mutateAsync({ id: item.id, platform: platform });
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkSold = async (data: { sold_price: number }) => {
    if (!item?.id) return;
    try {
      await markSold.mutateAsync({ id: item.id, sold_price: data.sold_price });
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        onClose();
      }, 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!item?.id) return;
    if (window.confirm("Bist du sicher, dass du diesen Artikel löschen möchtest?")) {
      deleteItem.mutate(item.id, { onSuccess: () => onClose() });
    }
  };

  const handleArchive = () => {
    if (!item?.id) return;
    updateItem.mutate({ id: item.id, status: "archived" }, { onSuccess: () => onClose() });
  };

  const getStepStatus = (index: number): "pending" | "completed" | "running" | "failed" => {
    if (pipelineStep === 0) return "pending";
    if (pipelineStep > index) return "completed";
    if (pipelineStep === index) return "running";
    return "pending";
  };

  const steps = [
    { name: "Optimiere Titel & SEO-Keywords...", status: getStepStatus(1) },
    { name: "Schreibe verkaufsfördernden Text...", status: getStepStatus(2) },
    { name: "Berechne optimale Preis-Szenarien...", status: getStepStatus(3) },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] lg:w-[540px] border-l bg-background shadow-2xl transition-transform duration-300 ease-out flex flex-col",
        item ? "translate-x-0" : "translate-x-full"
      )}
    >
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.15} />}

      {activeItem && (
        <>
          {/* === SOLD VIEW === */}
          {activeItem.status === "sold" ? (
            <SoldItemDetail item={activeItem} onClose={onClose} />
          ) : activeItem.status === "listed" ? (
            /* === LISTED VIEW === */
            <ListedItemDetail
              item={activeItem}
              onClose={onClose}
              onMarkSold={handleMarkSold}
              onArchive={handleArchive}
            />
          ) : (
            /* === DRAFT / ANALYZING / READY VIEW === */
            <>
              <div className="flex flex-col border-b bg-muted/20 sticky top-0 z-10 backdrop-blur-3xl">
                <div className="flex items-start justify-between px-6 pt-5 pb-3">
                  <div className="flex flex-col gap-1.5 overflow-hidden pr-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold tracking-tight truncate">{activeItem.title}</h2>
                      <ItemStatusBadge status={activeItem.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground mt-1">
                      <span className="flex items-center gap-1.5 text-primary/80">
                        <Box className="h-3.5 w-3.5" /> {activeItem.storage_location || "Lagerplatz zuweisen"}
                      </span>
                      <span className="flex items-center gap-1.5 opacity-70">
                        <Tag className="h-3.5 w-3.5" /> {activeItem.sku || "#ITM-NEU"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 pt-1">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted h-8 w-8" onClick={handleArchive} disabled={updateItem.isPending}>
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8" onClick={handleDelete} disabled={deleteItem.isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={onClose}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/80 bg-accent/40 rounded-lg px-3 py-2 border border-border/40">
                    <span className="font-medium text-foreground">{activeItem.brand || "-"}</span>
                    <span className="text-muted-foreground/60">&middot;</span>
                    <span>Zustand: <span className="font-medium">{activeItem.condition}</span></span>
                    <span className="text-muted-foreground/60">&middot;</span>
                    <span>EK: <span className="font-medium text-destructive">{Number(activeItem.purchase_price_ek).toFixed(2)}&euro;</span></span>
                    <span className="text-muted-foreground/60">&middot;</span>
                    <span>Größe: <span className="font-medium">{activeItem.size || "-"}</span></span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:px-8 md:py-6 space-y-4 flex-1 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Listing Pipeline
                  </h3>
                </div>

                {generateInsights.isPending && (
                  <div className="p-5 border rounded-xl bg-card/50 shadow-sm transition-all">
                    <PipelineProgress steps={steps} />
                  </div>
                )}

                {(insights || generateInsights.isSuccess) && generateInsights.data && (
                  <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <ReadyToListCard insights={generateInsights.data} purchasePrice={Number(activeItem.purchase_price_ek)} onPublish={handlePublish} />
                  </div>
                )}

                {insights && !generateInsights.data && (
                   <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                     <ReadyToListCard insights={insights} purchasePrice={Number(activeItem.purchase_price_ek)} onPublish={handlePublish} />
                   </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
