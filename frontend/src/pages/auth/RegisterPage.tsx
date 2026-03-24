import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrivacyLink } from "@/components/consent/PrivacyLink";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signUp = useAuthStore((s) => s.signUp);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password);
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrierung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">ResellOS</CardTitle>
          <p className="text-sm text-muted-foreground">Erstelle ein Konto</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div>
              <label className="text-sm font-medium">E-Mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium">Passwort</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registriere..." : "Registrieren"}
            </Button>
            <p className="text-center text-sm">
              Bereits ein Konto? <Link to="/login" className="text-primary hover:underline">Anmelden</Link>
            </p>
            <div className="text-center"><PrivacyLink /></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
