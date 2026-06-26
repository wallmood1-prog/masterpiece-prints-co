import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo | Gallerivm" },
      { name: "description", content: "Gallerivm porta i capolavori dell'arte nelle case di tutti con riproduzioni su tela di qualità museale." },
      { property: "og:title", content: "Chi siamo — Gallerivm" },
      { property: "og:url", content: "/chi-siamo" },
    ],
    links: [{ rel: "canonical", href: "/chi-siamo" }],
  }),
  component: () => (
    <article className="container-gallery max-w-3xl py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">La nostra storia</p>
      <h1 className="mt-3 font-display text-4xl">Chi siamo</h1>
      <div className="mt-8 space-y-5 leading-relaxed text-foreground/80">
        <p>
          Gallerivm nasce dalla passione per l'arte e dal desiderio di renderla accessibile a tutti.
          Selezioniamo i capolavori più amati della storia e li riproduciamo con la massima cura,
          trasformando ogni parete in una galleria personale.
        </p>
        <p>
          Ogni tela è realizzata con stampa ad alta definizione su materiali certificati di qualità
          museale e montata su telaio in legno massello, per garantire colori fedeli e una durata nel
          tempo.
        </p>
        <p>
          Crediamo che l'arte debba emozionare ogni giorno. Per questo curiamo ogni dettaglio, dalla
          stampa all'imballaggio, fino alla consegna a casa tua.
        </p>
      </div>
    </article>
  ),
});