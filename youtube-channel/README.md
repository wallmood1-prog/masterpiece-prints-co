# Canale YouTube "storie vere e strane della scienza": kit di produzione

> Progetto separato da Gallerivm. Si trova in questa cartella solo per comodità:
> quando creerai un repository dedicato, sposta tutta la cartella `youtube-channel/`.

## Cosa c'è qui

| File | A cosa serve |
|---|---|
| `scripts/01-self-experimenters.md` | Copione video 1: gli scienziati che hanno sperimentato su sé stessi (~21 min) |
| `scripts/02-carrington-event.md` | Copione video 2: la tempesta solare del 1859 e il rischio oggi (~16 min) |
| `scripts/03-kola-superdeep.md` | Copione video 3: il buco più profondo mai scavato (~15 min) |
| `scripts/04-natures-immortals.md` | Copione video 4: gli animali che sfidano la morte (~17 min) |
| `PUBLISHING.md` | Titoli, descrizioni, tag, miniature e capitoli per ogni video |
| `make_video.py` | Trasforma un copione in un video 1080p finito: voce, immagini, montaggio, sottotitoli |

Le durate sono stimate a 155 parole al minuto. **Non allungare i video per superare i 20 minuti:**
su YouTube conta la percentuale di video guardata, non la lunghezza. Sopra gli 8 minuti
puoi già inserire pubblicità a metà video, quindi tutti e 4 i video sono già sopra la soglia utile.

## La voce: Kokoro (gratuita, naturale, uso commerciale consentito)

- **Kokoro-82M** è un modello di sintesi vocale open source con licenza **Apache 2.0**:
  puoi usarlo commercialmente, anche su un canale monetizzato.
- Gira sul processore del PC, non serve una scheda video. Per 20 minuti di audio ci vogliono pochi minuti.
- Voci consigliate per la divulgazione (prova la stessa scena con ciascuna):
  - `am_michael`: maschile americana, calda (predefinita)
  - `am_fenrir`: maschile americana, più profonda
  - `bm_george`: maschile britannica, stile documentario
  - `af_heart`: femminile americana, la voce di qualità più alta del modello
- **Scegline una e non cambiarla più:** la voce è il "volto" del canale.

Alternative scartate e perché:
- **ElevenLabs**: la qualità è ottima, ma il piano gratuito non copre 4 video da 15–20 minuti e non dà diritti commerciali. Ha senso quando il canale guadagna.
- **XTTS-v2**: la licenza non consente l'uso commerciale.
- **Edge TTS** (le voci di Microsoft Edge): le voci sono buone, ma usarle fuori dal browser non è previsto dai termini d'uso. È un rischio inutile per un canale monetizzato.

## Installazione (Windows, una volta sola, circa 20 minuti)

1. **Python 3.11**: scaricalo da python.org. Durante l'installazione spunta *"Add Python to PATH"*.
2. **ffmpeg**: apri il Prompt dei comandi e scrivi `winget install ffmpeg`.
3. **espeak-ng** (serve a Kokoro per pronunciare le parole rare): scarica l'installer `.msi` da
   github.com/espeak-ng/espeak-ng/releases.
4. Nella cartella `youtube-channel` esegui:
   ```
   pip install -r requirements.txt
   ```
   Al primo avvio Kokoro scarica da solo il modello vocale (circa 300 MB).
5. **Immagini gratuite**: crea un account gratuito su pexels.com/api e copia la tua chiave API. Poi:
   ```
   setx PEXELS_API_KEY "la-tua-chiave"
   ```
   Chiudi e riapri il Prompt dei comandi. I contenuti di Pexels sono gratuiti anche per uso commerciale e non richiedono di citare la fonte.

## Produrre un video

```
# 1. Anteprima delle prime 5 scene, per scegliere la voce (1-2 minuti)
python make_video.py scripts/01-self-experimenters.md --only 5 --voice bm_george

# 2. Video completo
python make_video.py scripts/01-self-experimenters.md --voice bm_george

# 3. Con musica di sottofondo (scaricala dalla YouTube Audio Library, è gratuita)
python make_video.py scripts/01-self-experimenters.md --voice bm_george --music musica.mp3
```

Prima di cambiare voce, cancella `output/<nome-copione>/work/`: lo script riusa gli audio già generati.

Risultato in `output/<nome-copione>/`:
- `<nome>.mp4`: il video da caricare
- `<nome>.srt`: i sottotitoli da caricare su YouTube (Sottotitoli → Carica file → con timing)
- `chapters.txt`: i capitoli da incollare nella descrizione

### Il tuo 10% umano (è quello che ti rende monetizzabile)

YouTube **non monetizza** i contenuti "inautentici", cioè prodotti in serie senza un contributo umano.
Prima di ogni render:
1. **Leggi il copione** e cambia almeno qualche frase con il tuo stile: una battuta, un'opinione, una domanda.
2. **Controlla le immagini**: se una scena mostra qualcosa di sbagliato (per esempio un razzo moderno in una storia del 1954),
   metti un'immagine giusta in `assets/<nome-copione>/scene_07.jpg`, dove 07 è il numero della scena
   che lo script stampa durante il lavoro. Puoi metterne più di una: `scene_07_a.jpg`, `scene_07_b.jpg`.
3. **Fonti di immagini storiche gratuite e legali**: NASA e NOAA (pubblico dominio), Wikimedia Commons
   (controlla sempre la licenza: se è CC BY o CC BY-SA, cita l'autore nella descrizione), Library of Congress.
4. **Guarda il video finito** almeno a velocità 2x prima di pubblicarlo.

## Regole YouTube da rispettare

- **Contenuti sintetici**: al caricamento YouTube chiede se il video contiene contenuti alterati o sintetici realistici.
  Una voce narrante sintetica generica non imita una persona reale. Se però mostri immagini generate dall'AI
  che sembrano reali, rispondi **Sì**. Nel dubbio, rispondi Sì: non penalizza la distribuzione.
- **Niente voci clonate di persone reali**, mai.
- **Requisiti per la monetizzazione**: 1.000 iscritti e 4.000 ore di visualizzazione negli ultimi 12 mesi.

## Esperimento: 4 video, 30 giorni

Pubblica **1 video a settimana, sempre lo stesso giorno**: per esempio il sabato alle 15:00 italiane,
quando negli Stati Uniti è mattina. Dopo 30 giorni guarda YouTube Studio:

| Metrica | Segnale buono | Se è sotto |
|---|---|---|
| CTR (percentuale di clic sulla miniatura) | > 4% | Rifare miniatura e titolo |
| Visualizzazione media | > 35% della durata | L'inizio del video è debole: rivedere i primi 30 secondi |
| Pubblico che resta dopo 30 secondi | > 65% | Rivedere l'aggancio iniziale |
| Iscritti ogni 1.000 visualizzazioni | > 5 | Rafforzare l'identità del canale |

**Come decidere dopo i 4 video:**
- Almeno un video supera i 1.000 views e le metriche sono vicine ai valori buoni: si continua e si passa a 2 video a settimana.
- Tutti i video sono sotto i 300 views: si cambia formato prima di produrne altri.

Non sono numeri garantiti: sono soglie di lavoro per prendere decisioni con dati veri invece che a sensazione.
