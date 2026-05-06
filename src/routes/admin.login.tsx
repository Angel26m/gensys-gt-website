import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/admin" });
  },
});

function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    nav({ to: "/admin" });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-secondary px-6">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-lg">
        <Link to="/" className="text-xs text-muted-foreground hover:text-accent">← Back to site</Link>
        <h1 className="text-2xl font-bold text-primary mt-3 mb-1">Admin Login</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to manage products and quotes.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input name="email" type="email" required placeholder="Email" className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <input name="password" type="password" required placeholder="Password" className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <button disabled={loading} className="w-full bg-primary text-primary-foreground rounded-md py-2.5 font-medium hover:bg-primary/90 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
