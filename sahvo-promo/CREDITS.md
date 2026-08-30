# Photography credits — Sahvo promo

All five photographs were supplied by the client directly in-chat on
2026-08-29, without source pages, photographer names, or licence
statements. **Source, photographer and licence MUST be confirmed and
filled in below before this video is published.** If any image cannot be
traced to a free-for-commercial-use licence (Pexels/Unsplash/Pixabay
licence, CC0, or equivalent), replace it — the `PHOTOS` map in
`src/constants.ts` makes each image swappable without code changes.

Note: several of the supplied images show visual characteristics of
AI-generated imagery (rendering artefacts in architectural details and
figures). If they are AI-generated rather than stock photography, confirm
that this is acceptable for the brand before publishing.

| File | Used in | Source | Photographer | Licence |
|---|---|---|---|---|
| `public/photos/01-hawa-mahal.webp` | S1 hook | TBC | TBC | TBC |
| `public/photos/02-rickshaw.webp` | S2 backdrop | TBC | TBC | TBC |
| `public/photos/03-monument.webp` | S3 Jaipur | TBC | TBC | TBC |
| `public/photos/04-market.webp` | S6 (first half) | TBC | TBC | TBC |
| `public/photos/05-walking.webp` | S6 (second half) | TBC | TBC | TBC |

The sixth planned photograph (hands holding a phone, screen not visible,
for the S7 backdrop) was never delivered; S7 ships type-led without it.

# Sound credits

Freesound, Pixabay Audio and Zapsplat are unreachable from the build
environment (network egress policy), so every effect is **synthesized
procedurally** by `tools/make_sfx.py` (numpy/scipy) — no third-party
recordings, no licence required. Regenerate with
`python3 tools/make_sfx.py` after any retiming.

| Effect | Where | Source | Licence |
|---|---|---|---|
| Rule-sweep whoosh (300 ms, band-filtered noise) | each scene cut + hook | synthesized in-project | n/a (original work) |
| Odometer / bar detents (one per stop) | S2 | synthesized in-project | n/a |
| Pin thud + airy ripple swell | S3 "Jaipur" | synthesized in-project | n/a |
| Thermal printer feed bursts + paper tear | S5 receipt | synthesized in-project | n/a |
| Icon draw-on ticks | S5 features | synthesized in-project | n/a |
| Character-stagger ticks (very quiet) | S6 headline | synthesized in-project | n/a |

Mix: all effects peak ≥18 dB below the voiceover (track peaks −22.5 dBFS),
ducked a further 6 dB during voiced spans, high-passed at 200 Hz, nothing
longer than 400 ms except the pin-ripple swell, first/last 0.3 s clean,
no music bed.

# Reel 01 (35s light film) — audio

The Reel 01 music bed and all its effects are likewise **synthesized
procedurally** (`tools/make_reel01_audio.py`) — original work, no licence
required. The voiceover for the Reel 01 script has NOT been generated yet;
`src/reel01/constants.ts` documents the drop-in slot
(`public/audio/reel01-vo.mp3`, set `VO_PRESENT = true`).
