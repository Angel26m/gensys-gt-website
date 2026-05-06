import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminProducts,
});

type Product = Database["public"]["Tables"]["products"]["Row"];

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  async function load() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name")),
      description: String(fd.get("description") || "") || null,
      category: String(fd.get("category") || "General"),
      price: fd.get("price") ? Number(fd.get("price")) : null,
      image_url: String(fd.get("image_url") || "") || null,
      badge: String(fd.get("badge") || "") || null,
      in_stock: fd.get("in_stock") === "on",
    };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Product updated" : "Product added");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Products</h1>
          <p className="text-sm text-muted-foreground">Add or remove products shown on the site.</p>
        </div>
        <button onClick={() => setEditing({ in_stock: true, category: "General" })} className="bg-accent2 text-accent2-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {products.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">No products yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-primary">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{p.category}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.price ? `OMR ${p.price}` : "—"}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded ${p.in_stock ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                      {p.in_stock ? "In stock" : "Out"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(p)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                    <button onClick={() => remove(p.id)} className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-primary">{editing.id ? "Edit" : "Add"} Product</h2>
              <button type="button" onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <Input label="Name *" name="name" defaultValue={editing.name ?? ""} required />
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Description</label>
                <textarea name="description" rows={3} defaultValue={editing.description ?? ""} className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Category" name="category" defaultValue={editing.category ?? "General"} />
                <Input label="Price (OMR)" name="price" type="number" step="0.01" defaultValue={editing.price?.toString() ?? ""} />
              </div>
              <Input label="Image URL" name="image_url" defaultValue={editing.image_url ?? ""} placeholder="https://..." />
              <Input label="Badge" name="badge" defaultValue={editing.badge ?? ""} placeholder="e.g. New, In Stock" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="in_stock" defaultChecked={editing.in_stock ?? true} /> In stock
              </label>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={() => setEditing(null)} className="flex-1 border border-border rounded-md py-2 text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">{label}</label>
      <input {...rest} className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm" />
    </div>
  );
}
