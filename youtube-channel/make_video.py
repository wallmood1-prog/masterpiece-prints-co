#!/usr/bin/env python3
"""
make_video.py — turns a narration script into a finished 1080p YouTube video.

Pipeline (all free):
  1. Parse the script: every `[visual: keywords]` line starts a new scene,
     every `# Heading` becomes a YouTube chapter.
  2. Voiceover per scene with Kokoro TTS (open source, Apache-2.0, runs on CPU).
  3. Visuals per scene: your own images in assets/<script-name>/ first, then
     free stock videos/photos from Pexels (free API key), else a plain card.
  4. ffmpeg assembles everything: slow zooms on photos, cuts every few seconds,
     optional background music, subtitles (.srt) and chapters (.txt).

Usage:
  python make_video.py scripts/01-self-experimenters.md
  python make_video.py scripts/01-self-experimenters.md --voice bm_george --music music.mp3
  python make_video.py scripts/01-self-experimenters.md --tts dummy   # quick test, silent audio
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.parse
import urllib.request
from pathlib import Path

W, H, FPS = 1920, 1080, 30
SAMPLE_RATE = 24000
MAX_SHOT = 7.0          # seconds before cutting to the next clip/photo
SCENE_PAUSE = 0.45      # breathing pause after each scene
IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp"}
VIDEO_EXT = {".mp4", ".mov", ".webm"}


# ---------------------------------------------------------------- parsing

def parse_script(path):
    """Returns a list of scenes: {visual, text, chapter}."""
    scenes, chapter, current = [], None, None
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("<!--") or line.startswith(">"):
            continue
        if line.startswith("#"):
            chapter = line.lstrip("#").strip()
            continue
        m = re.match(r"\[visual:\s*(.+?)\]$", line, re.I)
        if m:
            current = {"visual": m.group(1).strip(), "text": "", "chapter": chapter}
            chapter = None
            scenes.append(current)
            continue
        if current is None:
            current = {"visual": "abstract background", "text": "", "chapter": chapter}
            chapter = None
            scenes.append(current)
        current["text"] = (current["text"] + " " + line).strip()
    return [s for s in scenes if s["text"]]


# ---------------------------------------------------------------- helpers

def run(cmd):
    r = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if r.returncode != 0:
        sys.exit(f"ffmpeg failed:\n{' '.join(cmd)}\n{r.stderr[-2000:]}")
    return r.stdout


def duration(path):
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
               "-of", "default=nw=1:nk=1", str(path)])
    return float(out.strip())


def ts(seconds, srt=True):
    ms = int(round(seconds * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}" if srt else (f"{h}:{m:02}:{s:02}" if h else f"{m:02}:{s:02}")


# ---------------------------------------------------------------- voice

class KokoroVoice:
    def __init__(self, voice, speed):
        from kokoro import KPipeline  # imported lazily so --tts dummy needs nothing
        self.voice, self.speed = voice, speed
        # first letter of the voice id is the language: a = American, b = British
        self.pipe = KPipeline(lang_code=voice[0], repo_id="hexgrad/Kokoro-82M")

    def say(self, text, out_wav):
        import numpy as np
        import soundfile as sf
        parts = [np.asarray(audio.cpu() if hasattr(audio, "cpu") else audio, dtype=np.float32)
                 for _, _, audio in self.pipe(text, voice=self.voice, speed=self.speed)
                 if audio is not None]
        audio = np.concatenate(parts) if parts else np.zeros(SAMPLE_RATE, dtype=np.float32)
        pad = np.zeros(int(SCENE_PAUSE * SAMPLE_RATE), dtype=audio.dtype)
        sf.write(out_wav, np.concatenate([audio, pad]), SAMPLE_RATE)


class DummyVoice:
    """Silent audio at ~155 words per minute: tests the pipeline in seconds."""
    def say(self, text, out_wav):
        secs = len(text.split()) / 155 * 60 + SCENE_PAUSE
        run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r={SAMPLE_RATE}:cl=mono",
             "-t", f"{secs:.2f}", str(out_wav)])


# ---------------------------------------------------------------- visuals

class Visuals:
    def __init__(self, assets_dir, cache_dir, api_key):
        self.assets = sorted(p for p in assets_dir.glob("*")
                             if p.suffix.lower() in IMAGE_EXT | VIDEO_EXT) if assets_dir.exists() else []
        self.cache, self.key, self.used = cache_dir, api_key, set()
        cache_dir.mkdir(parents=True, exist_ok=True)

    def own(self, idx):
        """assets/<script>/scene_07.jpg (or scene_07_b.mp4 …) overrides scene 7."""
        tag = f"scene_{idx:02}"
        return [p for p in self.assets if p.stem == tag or p.stem.startswith(tag + "_")]

    def _get(self, url):
        req = urllib.request.Request(url, headers={"Authorization": self.key, "User-Agent": "make_video"})
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.read()

    def _download(self, url, name):
        dest = self.cache / name
        if not dest.exists():
            dest.write_bytes(self._get(url))
        return dest

    def stock(self, query, need_seconds):
        if not self.key:
            return []
        q = urllib.parse.quote(query)
        picked, total = [], 0.0
        try:
            data = json.loads(self._get(f"https://api.pexels.com/videos/search?query={q}"
                                        f"&orientation=landscape&per_page=15"))
            for v in data.get("videos", []):
                if v["id"] in self.used or v.get("duration", 0) < 3:
                    continue
                files = [f for f in v["video_files"] if f.get("width") and f["width"] >= 1280]
                if not files:
                    continue
                best = min(files, key=lambda f: abs(f["width"] - W))
                picked.append(self._download(best["link"], f"v{v['id']}.mp4"))
                self.used.add(v["id"])
                total += min(v["duration"], MAX_SHOT)
                if total >= need_seconds:
                    return picked
            if picked:
                return picked
            data = json.loads(self._get(f"https://api.pexels.com/v1/search?query={q}"
                                        f"&orientation=landscape&per_page=10"))
            for p in data.get("photos", []):
                if p["id"] in self.used:
                    continue
                picked.append(self._download(p["src"]["large2x"], f"p{p['id']}.jpg"))
                self.used.add(p["id"])
                if len(picked) * MAX_SHOT >= need_seconds:
                    break
        except Exception as e:  # network or quota problems should not kill a 20-minute render
            print(f"   ! Pexels search failed for '{query}': {e}")
        return picked


FIT = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1,fps={FPS}"


def render_shot(src, secs, out, zoom_in):
    if src is None:
        run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c=0x0d1117:s={W}x{H}:r={FPS}",
             "-t", f"{secs:.3f}", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-preset", "veryfast", str(out)])
    elif src.suffix.lower() in IMAGE_EXT:
        frames = int(secs * FPS) + 1
        z = "min(1+0.10*on/{f},1.10)" if zoom_in else "max(1.10-0.10*on/{f},1.0)"
        z = z.format(f=frames)
        vf = (f"scale={W*2}:{H*2}:force_original_aspect_ratio=increase,crop={W*2}:{H*2},"
              f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps={FPS},setsar=1")
        run(["ffmpeg", "-y", "-loop", "1", "-i", str(src), "-vf", vf, "-t", f"{secs:.3f}",
             "-pix_fmt", "yuv420p", "-c:v", "libx264", "-preset", "veryfast", str(out)])
    else:
        run(["ffmpeg", "-y", "-stream_loop", "-1", "-i", str(src), "-vf", FIT, "-an",
             "-t", f"{secs:.3f}", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-preset", "veryfast", str(out)])


def render_scene(idx, sources, audio, out, work):
    total = duration(audio)
    shots, t, i = [], 0.0, 0
    while t < total - 0.01:
        secs = min(MAX_SHOT, total - t)
        src = sources[i % len(sources)] if sources else None
        shot = work / f"s{idx:02}_{i:02}.mp4"
        render_shot(src, secs, shot, zoom_in=(i % 2 == 0))
        shots.append(shot)
        t += secs
        i += 1
    lst = work / f"s{idx:02}.txt"
    lst.write_text("".join(f"file '{s.resolve().as_posix()}'\n" for s in shots))
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-i", str(audio),
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", str(out)])
    for s in shots:
        s.unlink()
    return total


# ---------------------------------------------------------------- subtitles & chapters

def subtitle_lines(text, start, length):
    """Splits a scene into short caption lines timed proportionally to their length."""
    sentences = re.split(r"(?<=[.!?])\s+", text)
    chunks = []
    for s in sentences:
        words, buf = s.split(), []
        for w in words:
            buf.append(w)
            if len(" ".join(buf)) > 70:
                chunks.append(" ".join(buf))
                buf = []
        if buf:
            chunks.append(" ".join(buf))
    speech = max(length - SCENE_PAUSE, 0.5)
    total_chars = sum(len(c) for c in chunks) or 1
    t, out = start, []
    for c in chunks:
        d = speech * len(c) / total_chars
        out.append((t, t + d, c))
        t += d
    return out


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("--voice", default="am_michael", help="Kokoro voice, e.g. am_michael, am_fenrir, bm_george, af_heart")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--tts", choices=["kokoro", "dummy"], default="kokoro")
    ap.add_argument("--music", help="optional background track (royalty-free), mixed quietly")
    ap.add_argument("--music-volume", type=float, default=0.07)
    ap.add_argument("--only", type=int, help="render only the first N scenes (preview)")
    args = ap.parse_args()

    script = Path(args.script)
    base = Path(__file__).parent
    name = script.stem
    out_dir = base / "output" / name
    work = out_dir / "work"
    work.mkdir(parents=True, exist_ok=True)

    scenes = parse_script(script)
    if args.only:
        scenes = scenes[: args.only]
    words = sum(len(s["text"].split()) for s in scenes)
    print(f"{len(scenes)} scenes, {words} words (~{words / 155:.1f} min)")

    voice = KokoroVoice(args.voice, args.speed) if args.tts == "kokoro" else DummyVoice()
    visuals = Visuals(base / "assets" / name, base / "cache", os.environ.get("PEXELS_API_KEY", ""))
    if not visuals.key:
        print("! PEXELS_API_KEY not set: only your own assets and plain cards will be used")

    clips, srt, chapters, t = [], [], [], 0.0
    for i, sc in enumerate(scenes, 1):
        print(f"[{i}/{len(scenes)}] {sc['visual']}")
        wav = work / f"a{i:02}.wav"
        if not wav.exists():
            voice.say(sc["text"], wav)
        length = duration(wav)
        sources = visuals.own(i) or visuals.stock(sc["visual"], length)
        clip = work / f"scene{i:02}.mp4"
        if not clip.exists():
            render_scene(i, sources, wav, clip, work)
        if sc["chapter"]:
            chapters.append(f"{ts(t, srt=False)} {sc['chapter']}")
        srt.extend(subtitle_lines(sc["text"], t, length))
        clips.append(clip)
        t += duration(clip)

    lst = work / "all.txt"
    lst.write_text("".join(f"file '{c.resolve().as_posix()}'\n" for c in clips))
    joined = work / "joined.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(joined)])

    final = out_dir / f"{name}.mp4"
    if args.music:
        run(["ffmpeg", "-y", "-i", str(joined), "-stream_loop", "-1", "-i", args.music,
             "-filter_complex",
             f"[1:a]volume={args.music_volume},afade=t=out:st={max(t - 4, 0):.2f}:d=4[m];"
             f"[0:a][m]amix=inputs=2:duration=first:dropout_transition=0[a]",
             "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", str(final)])
    else:
        shutil.copy(joined, final)

    (out_dir / f"{name}.srt").write_text(
        "\n".join(f"{n}\n{ts(a)} --> {ts(b)}\n{txt}\n" for n, (a, b, txt) in enumerate(srt, 1)),
        encoding="utf-8")
    if chapters and not chapters[0].startswith("00:00"):
        chapters.insert(0, "00:00 Intro")
    (out_dir / "chapters.txt").write_text("\n".join(chapters) + "\n", encoding="utf-8")
    print(f"\nDone: {final}  ({ts(t, srt=False)})\nSubtitles: {name}.srt  Chapters: chapters.txt")


if __name__ == "__main__":
    main()
