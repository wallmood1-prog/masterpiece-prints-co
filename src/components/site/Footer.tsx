import { Link } from "@tanstack/react-router";
import { Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-foreground text-background">
      <div className="container-gallery grid gap-10 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl tracking-[0.18em]">GALLERIVM</p>
          <p className="mt-4 max-w-xs text-sm text-background/70">
            Riproduzioni d'arte su tela di qualità museale. Trasforma le tue pareti in opere d'arte.
          </p>
        </div>
        <FooterCol
          title="Esplora"
          links={[
            { to: "/shop", label: "Shop" },
            { to: "/chi-siamo", label: "Chi siamo" },
            { to: "/faq", label: "FAQ" },
          ]}
        />
        <FooterCol
          title="Assistenza"
          links={[
            { to: "/contatti", label: "Contatti" },
            { to: "/privacy", label: "Privacy" },
            { to: "/termini", label: "Termini" },
          ]}
        />
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-background/90">Seguici</h4>
          <div className="mt-4 flex gap-3">
            <SocialLink label="Instagram"><Instagram className="h-5 w-5" /></SocialLink>
            <SocialLink label="Facebook"><Facebook className="h-5 w-5" /></SocialLink>
            <SocialLink label="Pinterest">
              <span className="text-sm font-semibold">P</span>
            </SocialLink>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container-gallery flex flex-col items-center justify-between gap-2 py-6 text-xs text-background/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Gallerivm. Tutti i diritti riservati.</p>
          <p>Spedizione sicura · Pagamenti protetti · Reso semplice</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-background/90">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-background/70 transition-colors hover:text-gold">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid h-10 w-10 place-items-center border border-background/20 transition-colors hover:border-gold hover:text-gold"
    >
      {children}
    </a>
  );
}