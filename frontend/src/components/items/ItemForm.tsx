import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateItem } from "@/hooks/useItems";
import { PrivacyLink } from "@/components/consent/PrivacyLink";
import { Box, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { onClose: () => void; onSuccess?: () => void; }

export function ItemForm({ onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("kleidung");
  const [brand, setBrand] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [condition, setCondition] = useState("good");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  
  // WaWi Fields
  const [storageLocation, setStorageLocation] = useState("");

  const createItem = useCreateItem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate a unique SKU
    const generatedSku = `ITM-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    await createItem.mutateAsync({
      title,
      category: category === "ohne" ? null : category,
      brand: category === "kleidung" ? (brand || "Unbekannt") : "Unbekannt",
      purchase_price_ek: parseFloat(purchasePrice),
      condition,
      size: category === "kleidung" ? (size || undefined) : undefined,
      color: category === "kleidung" ? (color || undefined) : undefined,
      sku: generatedSku,
      storage_location: storageLocation || undefined,
    });
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Category Selection */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Kategorie</label>
        <div className="flex gap-2">
          {["kleidung", "ohne"].map(cat => (
            <Button 
              key={cat} 
              type="button"
              variant={category === cat ? "default" : "outline"} 
              size="sm" 
              onClick={() => setCategory(cat)}
              className={cn("rounded-full px-5", category === cat && "shadow-sm")}
            >
              {cat === "kleidung" ? "👕 Kleidung" : "📦 Ohne Kategorie"}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><label className="text-sm font-medium">Was? (Titel) *</label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z.B. Nike Vintage Hoodie" required /></div>
        <div className="space-y-1"><label className="text-sm font-medium">EK-Preis (EUR) *</label><Input type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} required /></div>
      </div>

      {category === "kleidung" && (
        <div className="grid grid-cols-3 gap-3 p-3 bg-muted/40 border rounded-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="col-span-3 pb-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Kleidung Details</label>
          </div>
          <div><label className="text-xs font-medium">Marke</label><Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="z.B. Nike" className="h-9 text-sm" /></div>
          <div><label className="text-xs font-medium">Größe</label><Input value={size} onChange={(e) => setSize(e.target.value)} placeholder="z.B. M" className="h-9 text-sm" /></div>
          <div><label className="text-xs font-medium">Farbe</label><Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="z.B. Rot" className="h-9 text-sm" /></div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Zustand</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="new">Neu</option><option value="like_new">Wie neu</option><option value="good">Gut</option><option value="fair">Akzeptabel</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1.5"><Box className="w-4 h-4 text-muted-foreground"/> Lagerplatz</label>
          <Input value={storageLocation} onChange={(e) => setStorageLocation(e.target.value)} placeholder="z.B. Kiste 1 (Opt.)" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t mt-6">
        <PrivacyLink />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button type="submit" disabled={createItem.isPending} className="shadow-md">{createItem.isPending ? "Erstelle..." : "Artikel erstellen"}</Button>
        </div>
      </div>
    </form>
  );
}
