import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email);
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Passwort zuruecksetzen</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Falls ein Konto existiert, wurde eine E-Mail gesendet.</p>
              <Link to="/login" className="mt-4 inline-block text-sm text-primary hover:underline">Zurueck zum Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">E-Mail</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sende..." : "Link senden"}
              </Button>
              <p className="text-center text-sm">
                <Link to="/login" className="text-muted-foreground hover:underline">Zurueck zum Login</Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
