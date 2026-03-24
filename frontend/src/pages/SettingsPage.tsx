import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsentSettings } from "@/components/consent/ConsentSettings";
import { useAuthStore } from "@/stores/auth.store";
import { apiClient } from "@/lib/api-client";

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

      <ConsentSettings />

      <Card>
        <CardHeader><CardTitle className="text-lg">Meine Daten (DSGVO)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {/* GDPR Art. 20: Data portability */}
          <Button variant="outline" onClick={handleExport}>Daten exportieren (Art. 20)</Button>
          {/* GDPR Art. 17: Right to erasure */}
          <Button variant="destructive" onClick={handleDelete}>Konto & Daten loeschen (Art. 17)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
