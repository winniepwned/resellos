import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateItem } from "@/hooks/useItems";
import { PrivacyLink } from "@/components/consent/PrivacyLink";

interface Props { onClose: () => void; }

export function ItemForm({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [condition, setCondition] = useState("good");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const createItem = useCreateItem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createItem.mutateAsync({
      title, brand, purchase_price_ek: parseFloat(purchasePrice), condition, size: size || undefined, color: color || undefined,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="text-sm font-medium">Titel *</label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
      <div><label className="text-sm font-medium">Marke *</label><Input value={brand} onChange={(e) => setBrand(e.target.value)} required /></div>
      <div><label className="text-sm font-medium">EK-Preis (EUR) *</label><Input type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} required /></div>
      <div><label className="text-sm font-medium">Zustand</label>
        <select value={condition} onChange={(e) => setCondition(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="new">Neu</option><option value="like_new">Wie neu</option><option value="good">Gut</option><option value="fair">Akzeptabel</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium">Groesse</label><Input value={size} onChange={(e) => setSize(e.target.value)} /></div>
        <div><label className="text-sm font-medium">Farbe</label><Input value={color} onChange={(e) => setColor(e.target.value)} /></div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <PrivacyLink />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button type="submit" disabled={createItem.isPending}>{createItem.isPending ? "Erstelle..." : "Artikel erstellen"}</Button>
        </div>
      </div>
    </form>
  );
}
