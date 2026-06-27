const STORE = import.meta.env.VITE_SHOPIFY_STORE as string;
const TOKEN = import.meta.env.VITE_SHOPIFY_TOKEN as string;

export interface GvmProduct {
  slug: string; title: string; artist: string; style: string;
  category: string; year: string; price: number; color: string;
  file: string; imageUrl: string; description: string;
  isNew: boolean; bestseller: boolean; shopifyId: string;
  variants: {id: string; title: string; price: string; availableForSale: boolean}[];
  allImages: string[];
}

export async function fetchAllProducts(): Promise<GvmProduct[]> {
  try {
    const res = await fetch(`https://${STORE}/admin/api/2024-04/products.json?limit=250&status=active`, {
      headers: { 'X-Shopify-Access-Token': TOKEN }
    });
    if (!res.ok) throw new Error('API error');
    const json = await res.json();
    return json.products.map((p: any) => {
      const parts = (p.title as string).split(' - ');
      const tags: string[] = p.tags ? p.tags.split(', ') : [];
      const MOVEMENTS = ['Impressionism','Baroque Art','Post-Impressionism','Renaissance Art','Romanticism','Realism','Japanese Art Print'];
      const style = tags.find((t: string) => MOVEMENTS.includes(t)) ?? 'Museum Collection';
      return {
        slug: p.handle,
        title: parts[0]?.trim() ?? p.title,
        artist: parts[1]?.trim() ?? '',
        style, category: style, year: '',
        price: parseFloat(p.variants?.[0]?.price ?? '53.90'),
        color: 'neutral', file: '',
        imageUrl: p.image?.src ?? '',
        description: p.body_html ?? '',
        isNew: tags.includes('New Arrivals'),
        bestseller: false,
        shopifyId: String(p.id),
        variants: (p.variants ?? []).map((v: any) => ({
          id: String(v.id), title: v.title,
          price: v.price, availableForSale: true
        })),
        allImages: (p.images ?? []).map((i: any) => i.src),
      };
    });
  } catch {
    return [];
  }
}
