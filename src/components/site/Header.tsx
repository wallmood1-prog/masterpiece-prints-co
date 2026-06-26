import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/chi-siamo", label: "Chi siamo" },
  { to: "/faq", label: "FAQ" },
];

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-gallery flex h-16 items-center justify-between gap-4">
        <Link to="/" className="font-display text-2xl tracking-[0.18em]" aria-label="Gallerivm home">
          GALLERIVM
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/carrello"
            className="relative grid h-10 w-10 place-items-center transition-colors hover:text-gold"
            aria-label="Carrello"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center bg-gold text-[10px] font-semibold text-gold-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            className="grid h-10 w-10 place-items-center md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border md:hidden",
          open ? "max-h-72" : "max-h-0",
          "transition-all duration-300",
        )}
      >
        <nav className="container-gallery flex flex-col py-2">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="py-3 text-sm tracking-wide"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}