import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/termini")({
  head: () => ({
    meta: [
      { title: "Termini e Condizioni | Gallerivm" },
      { name: "description", content: "Termini e condizioni di vendita di Gallerivm." },
      { property: "og:url", content: "/termini" },
    ],
    links: [{ rel: "canonical", href: "/termini" }],
  }),
  component: () => (
    <article className="container-gallery max-w-3xl py-16">
      <h1 className="font-display text-4xl">Termini e Condizioni</h1>
      <div className="mt-8 space-y-5 leading-relaxed text-foreground/80">
        <p>Effettuando un ordine su Gallerivm accetti i presenti termini di vendita. Tutti i prezzi sono espressi in Euro e comprensivi di IVA.</p>
        <p>Le opere sono riproduzioni su tela di dipinti di pubblico dominio, realizzate su ordinazione. I tempi di produzione e consegna sono indicati in fase di acquisto.</p>
        <p>Il diritto di reso può essere esercitato entro 30 giorni dalla consegna, secondo le modalità indicate nella pagina FAQ.</p>
      </div>
    </article>
  ),
});