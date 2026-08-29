# Sahvo Promo — Remotion

Vertical promo video for Sahvo, cut against the ElevenLabs voiceover.
1080 × 1920 · 30fps · duration derived from `public/audio/vo.mp3` (60.19s → 1806 frames).

## ⚠️ Before rendering the final video

`public/screenshots/` currently contains **labeled placeholder slates**, not the
real website captures. Drop the eight real screenshots in under these exact
names (overwriting the slates):

```
public/screenshots/01-hero.png
public/screenshots/02-problem.png
public/screenshots/03-pilot.png
public/screenshots/04-sos.png
public/screenshots/05-guides.png
public/screenshots/06-price.png
public/screenshots/07-alerts.png
public/screenshots/08-languages.png
```

01, 02, 03 and 08 are lower resolution and are capped at 1.35× zoom in
`src/constants.ts` (`SCREENSHOTS[...].maxZoom`); 04–07 hold up to 1.6×.

## Editing the cut

Every timing value, colour and type size lives in **`src/constants.ts`** —
scene boundaries (`SCENES`), voice-sync beats (`BEATS`, absolute frames
measured from the VO), the sentence-5 feature onsets (`S5_FEATURES`), palette,
type scale and every on-screen string (`COPY`). Shift a beat there; no
component holds a number.

## Preview

```bash
npm i
npx remotion studio --no-open
```

Each scene is also registered individually under the `Scenes` folder in Studio.

## Render

```bash
npx remotion render SahvoPromo out/sahvo-promo.mp4
```

Expected output: H.264 MP4, 1080×1920 @ 30fps, ~60.2s, AAC audio.
If Remotion cannot download its headless browser (restricted network), point it
at a local Chromium headless shell:

```bash
npx remotion render SahvoPromo out/sahvo-promo.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

## Structure

```
src/
  constants.ts        # every timing/colour/type value (single source of truth)
  fonts.ts            # local Figtree + JetBrains Mono (public/fonts/, no network)
  SahvoPromo.tsx      # root composition: <Audio> + 8 scene <Sequence>s
  Root.tsx            # composition registry; duration from audio via mediabunny
  get-audio-duration.ts
  components/         # PortraitWindow (masked screenshot window), text, motion
  scenes/             # S1Thesis … S8Wordmark, one file per scene
```
