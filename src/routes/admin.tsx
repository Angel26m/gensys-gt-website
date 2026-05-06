import { createFileRoute, Link, Outlet, redirect, useNavigate, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Package, Inbox } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session && location.pathname !== "/admin/login") {
      throw redirect({ to: "/admin/login" });
    }
  },
});

function AdminLayout() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  if (pathname === "/admin/login") return <Outlet />;

  async function logout() {
    await supabase.auth.signOut();
    nav({ to: "/admin/login" });
  }

  const linkCls = (active: boolean) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
      active ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-secondary">
      <aside className="md:w-60 bg-card border-r border-border md:min-h-screen p-4">
        <Link to="/" className="block font-display font-bold text-primary mb-1">Genesys GT</Link>
        <div className="text-xs text-muted-foreground mb-6">Admin</div>
        <nav className="flex md:flex-col gap-1">
          <Link to="/admin" className={linkCls(pathname === "/admin")}>
            <Package size={16} /> Products
          </Link>
          <Link to="/admin/quotes" className={linkCls(pathname === "/admin/quotes")}>
            <Inbox size={16} /> Quotes
          </Link>
          <button onClick={logout} className={linkCls(false) + " md:mt-auto md:absolute md:bottom-4 md:left-4 md:right-4"}>
            <LogOut size={16} /> Sign out
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
