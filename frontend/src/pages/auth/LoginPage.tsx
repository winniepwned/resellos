import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrivacyLink } from "@/components/consent/PrivacyLink";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">ResellOS</CardTitle>
          <p className="text-sm text-muted-foreground">Melde dich an</p>
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
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Anmelden..." : "Anmelden"}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <Link to="/register" className="text-primary hover:underline">Registrieren</Link>
              <Link to="/forgot-password" className="text-muted-foreground hover:underline">Passwort vergessen?</Link>
            </div>
            <div className="text-center"><PrivacyLink /></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
