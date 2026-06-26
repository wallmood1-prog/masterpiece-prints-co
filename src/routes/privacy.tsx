import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Gallerivm" },
      { name: "description", content: "Informativa sulla privacy di Gallerivm: come trattiamo e proteggiamo i tuoi dati." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <article className="container-gallery max-w-3xl py-16">
      <h1 className="font-display text-4xl">Privacy Policy</h1>
      <div className="mt-8 space-y-5 leading-relaxed text-foreground/80">
        <p>Gallerivm tratta i dati personali nel rispetto del Regolamento UE 2016/679 (GDPR). Raccogliamo solo i dati necessari a evadere gli ordini e migliorare l'esperienza d'acquisto.</p>
        <p>I dati di pagamento sono gestiti tramite fornitori certificati con transazioni cifrate; non conserviamo i dati delle carte.</p>
        <p>Puoi richiedere in qualsiasi momento l'accesso, la modifica o la cancellazione dei tuoi dati scrivendo a info@gallerivm.com.</p>
      </div>
    </article>
  ),
});