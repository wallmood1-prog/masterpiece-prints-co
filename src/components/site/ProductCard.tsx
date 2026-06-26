import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { artworkImage, formatPrice, SIZES, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      slug: product.slug,
      title: product.title,
      artist: product.artist,
      file: product.file,
      size: SIZES[1].label,
      price: Math.round(product.price * SIZES[1].factor),
    });
    toast.success(`"${product.title}" aggiunto al carrello`);
  };

  return (
    <div className="group flex flex-col">
      <Link
        to="/opera/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden bg-secondary"
      >
        <div className="aspect-[4/5] w-full">
          <img
            src={artworkImage(product.file, 700)}
            alt={`${product.title} di ${product.artist} — riproduzione su tela`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-gold px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-gold-foreground">
            Novità
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <Link to="/opera/$slug" params={{ slug: product.slug }}>
          <h3 className="font-display text-lg leading-tight">{product.title}</h3>
        </Link>
        <p className="mt-0.5 text-sm text-muted-foreground">{product.artist}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-base font-medium">{formatPrice(product.price)}</span>
          <Button variant="goldOutline" size="sm" onClick={handleAdd}>
            <ShoppingBag /> Aggiungi
          </Button>
        </div>
      </div>
    </div>
  );
}