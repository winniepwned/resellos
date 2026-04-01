import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsentSettings } from "@/components/consent/ConsentSettings";
import { useAuthStore } from "@/stores/auth.store";
import { apiClient } from "@/lib/api-client";
import { useThemeStore } from "@/stores/theme.store";
import { Moon, Sun } from "lucide-react";

export function SettingsPage() {
  const session = useAuthStore((s) => s.session);
  const signOut = useAuthStore((s) => s.signOut);

  const handleExport = async () => {
    try {
      const data = await apiClient<unknown>("/me/export");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "meine-daten.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bist du sicher, dass du dein Konto und alle Daten loeschen moechtest? Dies kann nicht rueckgaengig gemacht werden.")) return;
    try {
      await apiClient("/me", { method: "DELETE" });
      await signOut();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Einstellungen</h1>

      <Card>
        <CardHeader><CardTitle className="text-lg">Konto</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Angemeldet als: {session?.user?.email}</p>
          <Button variant="outline" onClick={signOut}>Abmelden</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Darstellung</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Erscheinungsbild</p>
              <p className="text-xs text-muted-foreground">Waehle zwischen hellem und dunklem Design.</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-1">
              <Button
                variant={useThemeStore((s) => s.theme) === "light" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => useThemeStore.getState().setTheme("light")}
                className="h-8 px-2"
              >
                <Sun className="h-4 w-4 mr-1" />
                Hell
              </Button>
              <Button
                variant={useThemeStore((s) => s.theme) === "dark" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => useThemeStore.getState().setTheme("dark")}
                className="h-8 px-2"
              >
                <Moon className="h-4 w-4 mr-1" />
                Dunkel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConsentSettings />

      <Card>
        <CardHeader><CardTitle className="text-lg">Meine Daten (DSGVO)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {/* GDPR Art. 20: Data portability */}
          <Button variant="outline" onClick={handleExport}>Daten exportieren</Button>
          {/* GDPR Art. 17: Right to erasure */}
          <Button variant="destructive" onClick={handleDelete}>Konto & Daten loeschen</Button>
        </CardContent>
      </Card>
    </div>
  );
}
