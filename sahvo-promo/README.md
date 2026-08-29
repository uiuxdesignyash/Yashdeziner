# Sahvo Promo — Remotion

Vertical promo video for Sahvo, cut against the ElevenLabs voiceover.
1080 × 1920 · 30fps · duration derived from `public/audio/vo.mp3` (60.19s → 1806 frames).

## Photography

Five treated photographs (supplied by the client) drive the photo-led
scenes — see `CREDITS.md`: **source and licence must be confirmed before
publishing.** Each lives in a `PHOTOS` slot in `src/constants.ts` and is
swappable without code changes; a missing slot (src: null) falls back to
the code-built Jaipur backdrop. The treatment pipeline (PhotoLayer) is
mandatory: desaturate 25% → navy multiply 60% → colour-dodge corner 12% →
grain → Ken Burns 1.00→1.06.

## Reel-safe text zone

Text is confined to y 260–1460 with 96px side margins (and ends left of
x=900 below the midline) so Instagram's UI never covers it — see `LAYOUT`
in `src/constants.ts`. Full-bleed photography and glows may bleed edge to
edge; text and graphic panels may not.

Subtitles are NOT burned in: `sahvo-promo.srt` is timed to the measured VO.
The reel cover is frame 1 (`out/cover-frame1.png`).

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
