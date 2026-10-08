"""Weissen Hintergrund in Produktbilder einbauen.

- Transparente Bilder (Alpha-Kanal): auf weiss flatten.
- Bilder mit hellem Studio-Hintergrund: Flood-Fill von den Raendern
  (nur verbundene, aehnliche Pixel entfernen -> keine Loecher im Produkt),
  dann auf weiss flatten.

Nutzung: python tools/weiss_bg.py [--toleranz N] [--trocken]
"""
from __future__ import annotations

import argparse
import os
import sys
from collections import deque
from pathlib import Path

from PIL import Image

TEILE = Path(__file__).resolve().parent.parent / "public" / "teile"

# Bilder, die bereits weiss sind -> ueberspringen
BEREITS_WEISS = {"stiefel.jpg"}


def eckfarbe(im: Image.Image) -> tuple[int, int, int]:
    """Durchschnitt der vier Eckpixel als RGB."""
    rgba = im.convert("RGBA")
    w, h = rgba.size
    ecken = [rgba.getpixel((0, 0)), rgba.getpixel((w - 1, 0)),
             rgba.getpixel((0, h - 1)), rgba.getpixel((w - 1, h - 1))]
    rgb = [(r, g, b) for r, g, b, _ in ecken]
    return tuple(round(sum(c[i] for c in rgb) / len(rgb)) for i in range(3))


def ist_hell(px: tuple[int, int, int], schwelle: int = 180) -> bool:
    """Heller Hintergrund (alle Kanaele ueber Schwelle)?"""
    return all(c >= schwelle for c in px)


def flood_fill_hintergrund(im: Image.Image, toleranz: int) -> Image.Image:
    """Macht verbundene, randaehnliche Pixel transparent (Flood-Fill von aussen)."""
    rgba = im.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    start = eckfarbe(rgba)
    if not ist_hell(start):
        # Kein heller Hintergrund -> nichts tun
        return rgba

    besucht = [[False] * w for _ in range(h)]
    queue: deque[tuple[int, int]] = deque()
    for x in range(w):
        for y in (0, h - 1):
            if not besucht[y][x]:
                besucht[y][x] = True
                queue.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not besucht[y][x]:
                besucht[y][x] = True
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        if abs(r - start[0]) <= toleranz and abs(g - start[1]) <= toleranz and abs(b - start[2]) <= toleranz:
            px[x, y] = (r, g, b, 0)
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < w and 0 <= ny < h and not besucht[ny][nx]:
                    besucht[ny][nx] = True
                    queue.append((nx, ny))
    return rgba


def auf_weiss(im: Image.Image) -> Image.Image:
    """Legt das Bild auf weissen Grund."""
    rgba = im.convert("RGBA")
    grund = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
    grund.alpha_composite(rgba)
    return grund.convert("RGB")


def verarbeite(datei: Path, toleranz: int, trocken: bool) -> str:
    im = Image.open(datei)
    hat_alpha = im.mode in ("RGBA", "LA", "PA") or (
        im.mode == "P" and "transparency" in im.info
    )

    if datei.name in BEREITS_WEISS:
        return f"{datei.name:28s} uebersprungen (bereits weiss)"

    if hat_alpha:
        # Transparent -> weisser Grund dahinter
        ergebnis = auf_weiss(im)
        aktion = "transparent -> weiss"
    else:
        # RGB -> heller Hintergrund per Flood-Fill entfernen, dann weiss
        start = eckfarbe(im)
        if ist_hell(start):
            ohne_bg = flood_fill_hintergrund(im, toleranz)
            ergebnis = auf_weiss(ohne_bg)
            aktion = f"flood-fill (toleranz {toleranz}) -> weiss"
        else:
            ergebnis = im.convert("RGB")
            aktion = "kein heller Hintergrund, unveraendert"

    if not trocken:
        ergebnis.save(datei)
    return f"{datei.name:28s} {aktion}"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--toleranz", type=int, default=40,
                        help="Farbtoleranz fuer Flood-Fill (Standard 40)")
    parser.add_argument("--trocken", action="store_true",
                        help="Nur analysieren, nichts speichern")
    args = parser.parse_args()

    dateien = sorted(TEILE.glob("*"))
    for datei in dateien:
        if datei.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        print(verarbeite(datei, args.toleranz, args.trocken))
    return 0


if __name__ == "__main__":
    sys.exit(main())