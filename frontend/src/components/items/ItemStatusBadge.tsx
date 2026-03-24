import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ItemStatus } from "@/types";

const statusConfig: Record<ItemStatus, { label: string; className: string }> = {
  draft: { label: "Entwurf", className: "bg-muted text-muted-foreground" },
  analyzing: { label: "Analyse...", className: "bg-blue-500/20 text-blue-400" },
  ready: { label: "Bereit", className: "bg-green-500/20 text-green-400" },
  listed: { label: "Gelistet", className: "bg-yellow-500/20 text-yellow-400" },
  sold: { label: "Verkauft", className: "bg-emerald-500/20 text-emerald-400" },
  archived: { label: "Archiviert", className: "bg-gray-500/20 text-gray-400" },
};

export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  const config = statusConfig[status] || statusConfig.draft;
  return <Badge className={cn("border-0", config.className)}>{config.label}</Badge>;
}
