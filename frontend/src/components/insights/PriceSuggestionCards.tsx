import { Card, CardContent } from "@/components/ui/card";

interface Props { low: number | null; optimal: number | null; high: number | null; }

export function PriceSuggestionCards({ low, optimal, high }: Props) {
  const cards = [
    { label: "Schnellverkauf", value: low, color: "text-yellow-400" },
    { label: "Optimal", value: optimal, color: "text-green-400" },
    { label: "Max Profit", value: high, color: "text-blue-400" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className={`mt-1 text-xl font-bold ${c.color}`}>{c.value != null ? `${c.value.toFixed(2)} EUR` : "-"}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
