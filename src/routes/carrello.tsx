import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { artworkImage, formatPrice } from "@/lib/products";

export const Route = createFileRoute("/carrello")({
  head: () => ({
    meta: [
      { title: "Carrello | Gallerivm" },
      { name: "description", content: "Rivedi le tue opere selezionate e procedi al checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, updateQty, removeItem, subtotal, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = subtotal > 0 && subtotal < 100 ? 9.9 : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "ARTE10") {
      setDiscount(subtotal * 0.1);
      toast.success("Coupon ARTE10 applicato: -10%");
    } else {
      setDiscount(0);
      toast.error("Coupon non valido");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-gallery py-32 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-6 font-display text-3xl">Il tuo carrello è vuoto</h1>
        <p className="mt-2 text-muted-foreground">Scopri i capolavori della nostra collezione.</p>
        <Button asChild variant="gold" size="xl" className="mt-8">
          <Link to="/shop">Esplora la collezione</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-gallery py-12">
      <h1 className="font-display text-4xl">Carrello</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <div key={`${item.slug}-${item.size}`} className="flex gap-4 py-6">
              <Link to="/opera/$slug" params={{ slug: item.slug }} className="h-28 w-24 shrink-0 overflow-hidden bg-secondary">
                <img src={artworkImage(item.file, 300)} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg leading-tight">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.artist}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{item.size}</p>
                  </div>
                  <button onClick={() => removeItem(item.slug, item.size)} aria-label="Rimuovi" className="h-fit text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center border border-input">
                    <button onClick={() => updateQty(item.slug, item.size, item.qty - 1)} className="grid h-9 w-9 place-items-center hover:bg-secondary" aria-label="Riduci">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.slug, item.size, item.qty + 1)} className="grid h-9 w-9 place-items-center hover:bg-secondary" aria-label="Aumenta">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="py-4">
            <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">
              Svuota carrello
            </button>
          </div>
        </div>

        {/* Riepilogo */}
        <aside className="h-fit bg-secondary p-6">
          <h2 className="font-display text-2xl">Riepilogo</h2>

          <div className="mt-6 flex gap-2">
            <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Codice coupon" className="h-11 bg-background" />
            <Button variant="outline" className="h-11" onClick={applyCoupon}>Applica</Button>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <Row label="Subtotale" value={formatPrice(subtotal)} />
            {discount > 0 && <Row label="Sconto" value={`- ${formatPrice(discount)}`} />}
            <Row label="Spedizione" value={shipping === 0 ? "Gratuita" : formatPrice(shipping)} />
            <div className="border-t border-border pt-3">
              <Row label="Totale" value={formatPrice(total)} bold />
            </div>
          </dl>

          <Button variant="gold" size="xl" className="mt-6 w-full" onClick={() => toast.info("Checkout in arrivo: integrazione pagamenti in fase di attivazione.")}>
            Procedi al checkout
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Pagamenti protetti · Spedizione tracciata</p>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-semibold" : ""}`}>
      <dt className={bold ? "" : "text-muted-foreground"}>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}