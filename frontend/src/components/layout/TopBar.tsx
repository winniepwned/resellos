import { Search } from "lucide-react";
import { useCommandPaletteStore } from "@/stores/command-palette.store";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuthStore } from "@/stores/auth.store";

export function TopBar() {
  const openPalette = useCommandPaletteStore((s) => s.open);
  const session = useAuthStore((s) => s.session);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <button
        onClick={openPalette}
        className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
      >
        <Search className="h-4 w-4" />
        <span>Suche...</span>
        <kbd className="ml-4 rounded border bg-muted px-1.5 py-0.5 text-xs">Cmd+K</kbd>
      </button>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
            {session?.user?.email?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
