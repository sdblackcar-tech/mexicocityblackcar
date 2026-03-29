import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! You can now sign in.");
        setMode("login");
      }
      return;
    }

    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError("Invalid credentials");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl text-foreground">
            {mode === "login" ? "Admin Access" : "Create Account"}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {mode === "login" ? "Sign in to manage booking requests" : "Create your admin account"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-destructive text-sm text-center bg-destructive/10 rounded-md p-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-emerald-400 text-sm text-center bg-emerald-500/10 rounded-md p-2">
                {success}
              </div>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>No account?{" "}<button type="button" className="text-primary hover:underline" onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}>Create one</button></>
              ) : (
                <>Have an account?{" "}<button type="button" className="text-primary hover:underline" onClick={() => { setMode("login"); setError(""); setSuccess(""); }}>Sign in</button></>
              )}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
