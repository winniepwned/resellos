import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { useCommandPaletteStore } from "@/stores/command-palette.store";
import { LayoutDashboard, Package, Search, Settings } from "lucide-react";

const commands = [
  { label: "Gehe zu Dashboard", icon: LayoutDashboard, action: "/dashboard" },
  { label: "Gehe zu Inventar", icon: Package, action: "/inventory" },
  { label: "Gehe zu Sourcing", icon: Search, action: "/sourcing" },
  { label: "Einstellungen", icon: Settings, action: "/settings" },
];

export function CommandPalette() {
  const { isOpen, close } = useCommandPaletteStore();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useCommandPaletteStore.getState().toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/50" onClick={close} />
      <div className="relative w-full max-w-lg rounded-lg border bg-card shadow-2xl">
        <Command className="overflow-hidden rounded-lg">
          <Command.Input
            placeholder="Suche oder Befehl eingeben..."
            className="h-12 w-full border-b bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Command.List className="max-h-64 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              Keine Ergebnisse.
            </Command.Empty>
            <Command.Group heading="Navigation" className="text-xs text-muted-foreground px-2 py-1.5">
              {commands.map((cmd) => (
                <Command.Item
                  key={cmd.action}
                  onSelect={() => { navigate(cmd.action); close(); }}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                >
                  <cmd.icon className="h-4 w-4 text-muted-foreground" />
                  {cmd.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
