export type Product = {
  slug: string;
  title: string;
  artist: string;
  style: string;
  category: string;
  year: string;
  price: number;
  color: string;
  file: string;
  description: string;
  bestseller?: boolean;
  isNew?: boolean;
};

const FILE_BASE = "https://commons.wikimedia.org/wiki/Special:FilePath/";

/** Build a width-constrained Wikimedia image URL (server-resized, optimized). */
export function artworkImage(file: string, width = 800): string {
  return `${FILE_BASE}${encodeURIComponent(file)}?width=${width}`;
}

export const SIZES = [
  { label: '30 × 40 cm', factor: 1 },
  { label: '50 × 70 cm', factor: 1.5 },
  { label: '70 × 100 cm', factor: 2.1 },
  { label: '100 × 140 cm', factor: 3 },
] as const;

export const STYLES = [
  "Rinascimento",
  "Impressionismo",
  "Arte Moderna",
  "Astrattismo",
  "Espressionismo",
  "Barocco",
];

export const COLORS = ["Blu", "Oro", "Verde", "Rosso", "Neutro", "Multicolore"];

export const products: Product[] = [
  {
    slug: "notte-stellata",
    title: "Notte Stellata",
    artist: "Vincent van Gogh",
    style: "Impressionismo",
    category: "Van Gogh",
    year: "1889",
    price: 89,
    color: "Blu",
    file: "Van Gogh - Starry Night - Google Art Project.jpg",
    description:
      "Vortici di luce e cielo notturno: uno dei dipinti più amati di sempre, riprodotto con fedeltà cromatica assoluta su tela museale.",
    bestseller: true,
  },
  {
    slug: "girasoli",
    title: "Girasoli",
    artist: "Vincent van Gogh",
    style: "Impressionismo",
    category: "Van Gogh",
    year: "1888",
    price: 79,
    color: "Oro",
    file: "Vincent Willem van Gogh 127.jpg",
    description:
      "La calda intensità dei gialli di Van Gogh, perfetta per portare luce e carattere in ogni ambiente.",
    bestseller: true,
  },
  {
    slug: "terrazza-caffe-notte",
    title: "Terrazza del Caffè la Sera",
    artist: "Vincent van Gogh",
    style: "Impressionismo",
    category: "Van Gogh",
    year: "1888",
    price: 85,
    color: "Oro",
    file: "Vincent Willem van Gogh - Cafe Terrace at Night (Yorck).jpg",
    description:
      "Atmosfera notturna e luci dorate in una delle scene più iconiche di Arles.",
    isNew: true,
  },
  {
    slug: "ninfee",
    title: "Ninfee",
    artist: "Claude Monet",
    style: "Impressionismo",
    category: "Monet",
    year: "1906",
    price: 95,
    color: "Verde",
    file: "Claude Monet - Water Lilies - 1906, Ryerson.jpg",
    description:
      "L'armonia delle acque di Giverny: pennellate luminose e una quiete senza tempo.",
    bestseller: true,
  },
  {
    slug: "impressione-levar-del-sole",
    title: "Impressione, Levar del Sole",
    artist: "Claude Monet",
    style: "Impressionismo",
    category: "Monet",
    year: "1872",
    price: 89,
    color: "Neutro",
    file: "Monet - Impression, Sunrise.jpg",
    description:
      "Il dipinto che diede il nome all'Impressionismo, in tutta la sua delicatezza atmosferica.",
  },
  {
    slug: "gioconda",
    title: "La Gioconda",
    artist: "Leonardo da Vinci",
    style: "Rinascimento",
    category: "Leonardo da Vinci",
    year: "1503",
    price: 99,
    color: "Neutro",
    file: "Mona Lisa, by Leonardo da Vinci, from C2RMF retouched.jpg",
    description:
      "Il sorriso più celebre della storia dell'arte, riprodotto con dettaglio straordinario.",
    bestseller: true,
  },
  {
    slug: "il-bacio",
    title: "Il Bacio",
    artist: "Gustav Klimt",
    style: "Arte Moderna",
    category: "Klimt",
    year: "1908",
    price: 105,
    color: "Oro",
    file: "The Kiss - Gustav Klimt - Google Cultural Institute.jpg",
    description:
      "Oro, passione e decorazione: il capolavoro simbolista di Klimt nella sua massima eleganza.",
    bestseller: true,
  },
  {
    slug: "ritratto-adele",
    title: "Ritratto di Adele Bloch-Bauer",
    artist: "Gustav Klimt",
    style: "Arte Moderna",
    category: "Klimt",
    year: "1907",
    price: 109,
    color: "Oro",
    file: "Gustav Klimt 046.jpg",
    description: "La 'Dama d'oro' di Klimt, un trionfo di lusso e raffinatezza decorativa.",
    isNew: true,
  },
  {
    slug: "composizione-viii",
    title: "Composizione VIII",
    artist: "Vasilij Kandinskij",
    style: "Astrattismo",
    category: "Kandinsky",
    year: "1923",
    price: 89,
    color: "Multicolore",
    file: "Vassily Kandinsky, 1923 - Composition 8, huile sur toile, 140 cm x 201 cm, Musée Guggenheim, New York.jpg",
    description:
      "Geometrie e colore puro: l'astrazione lirica di Kandinskij per interni contemporanei.",
    bestseller: true,
  },
  {
    slug: "ragazza-orecchino-perla",
    title: "Ragazza con l'Orecchino di Perla",
    artist: "Johannes Vermeer",
    style: "Barocco",
    category: "Rinascimento",
    year: "1665",
    price: 92,
    color: "Blu",
    file: "1665 Girl with a Pearl Earring.jpg",
    description: "Lo sguardo enigmatico e la luce perlacea di uno dei ritratti più amati al mondo.",
    bestseller: true,
  },
  {
    slug: "lurlo",
    title: "L'Urlo",
    artist: "Edvard Munch",
    style: "Espressionismo",
    category: "Arte Moderna",
    year: "1893",
    price: 85,
    color: "Rosso",
    file: "Edvard Munch, 1893, The Scream, oil, tempera and pastel on cardboard, 91 x 73 cm, National Gallery of Norway.jpg",
    description: "L'angoscia universale resa immortale: un'icona assoluta dell'arte moderna.",
  },
  {
    slug: "nascita-di-venere",
    title: "La Nascita di Venere",
    artist: "Sandro Botticelli",
    style: "Rinascimento",
    category: "Rinascimento",
    year: "1485",
    price: 98,
    color: "Neutro",
    file: "Sandro Botticelli - La nascita di Venere - Google Art Project - edited.jpg",
    description: "La grazia rinascimentale per eccellenza, in una riproduzione di rara finezza.",
    isNew: true,
  },
];

export const categories = [
  { name: "Rinascimento", key: "Rinascimento" },
  { name: "Impressionismo", key: "Impressionismo" },
  { name: "Arte Moderna", key: "Arte Moderna" },
  { name: "Astrattismo", key: "Astrattismo" },
  { name: "Van Gogh", key: "Van Gogh" },
  { name: "Monet", key: "Monet" },
  { name: "Leonardo da Vinci", key: "Leonardo da Vinci" },
  { name: "Klimt", key: "Klimt" },
  { name: "Kandinsky", key: "Kandinsky" },
];

export const artists = [...new Set(products.map((p) => p.artist))].sort();

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function relatedProducts(p: Product, limit = 4): Product[] {
  return products
    .filter((x) => x.slug !== p.slug && (x.artist === p.artist || x.style === p.style))
    .slice(0, limit);
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}