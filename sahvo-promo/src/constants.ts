/**
 * Every timing value, colour and type size in the video lives here.
 * Shift a beat by editing this file only — no component holds a number.
 *
 * All frame values are ABSOLUTE frames at 30fps, measured against the
 * ElevenLabs voiceover (60.19s → 1806 frames). Scene components receive
 * scene-relative frames from <Sequence>; use rel() to convert.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Fallback only — the real duration is derived from the audio file in Root.tsx. */
export const FALLBACK_DURATION_IN_FRAMES = 1806;

export const AUDIO_SRC = "audio/vo.mp3";

// ─── Brand assets ───────────────────────────────────────────────────────────
// Primary_logo2.png: the all-white lockup on transparency, 1988×656 — the
// only version used in this video. pin.png is the pin glyph CROPPED from it
// (x 1104–1606), never redrawn. Rules: no recolour, no stretch, no rotation,
// moves as one object, never below 140px lockup width.
export const BRAND = {
  logo: "brand/Primary_logo2.png",
  logoAspect: 656 / 1988, // height / width
  pin: "brand/pin.png",
  pinAspect: 502 / 600, // width / height
  cornerWidth: 180,
  cornerX: 96,
  cornerY: 272, // clear of Instagram's ~220px top overlay
  cornerOpacity: 0.55,
  closeWidth: 620,
  pinDropHeight: 220,
} as const;
/** Synthesized SFX track (tools/make_sfx.py) — regenerate after retiming. */
export const SFX_SRC = "audio/sfx.wav";

// ─── Palette — the six permitted values ─────────────────────────────────────
export const COLORS = {
  canvas: "#0B1320",
  surface: "#16233A",
  raised: "#1E3050",
  ink: "#F4F7FC", // ALL text
  soft: "#8FB0FF", // small mono labels only, 24px minimum
  brand: "#0B53FF", // never text — fills, rules, bars, glows
} as const;

// ─── Type scale (px) ────────────────────────────────────────────────────────
export const TYPE = {
  url: 100, // sahvoapp.com in S7 — the largest type in the video
  wordmark: 132, // S8 closing wordmark
  display: 96, // S6 promise line
  headline: 84, // scene headlines
  body: 44, // supporting lines
  editorial: 34, // secondary editorial lines under headlines (78% ink)
  mono: 28, // kickers and labels (JetBrains Mono)
  monoSmall: 24, // absolute minimum for soft-blue mono
  brandMark: 40, // small corner mark in S1
  ghostNumeral: 520, // per-scene chapter numeral, 8% opacity
} as const;

// ─── Layout ─────────────────────────────────────────────────────────────────
// TEXT-SAFE ZONE for Instagram Reels: the app covers the top ~220px (handle,
// audio ticker) and bottom ~420px (caption, actions), plus the right rail
// below the midline. TEXT must respect these; backgrounds, glows and
// screenshot windows may bleed edge to edge.
export const LAYOUT = {
  marginX: 96,
  textTop: 260, // no text above this line
  textBottom: 1460, // no text below this line
  textRightBelowMid: WIDTH - 180, // below y=960, text must end left of x=900
  midline: HEIGHT / 2,
  blockGap: 40, // minimum between text blocks
  headlineBodyGap: 64,
  windowW: 912, // portrait screenshot window
  windowH: 1020,
  windowRadius: 48,
  windowX: (WIDTH - 912) / 2, // 84
  railX: 28, // persistent chapter rail, left edge
  railTop: 260,
  railBottom: 1460,
  ruleThickness: 3, // headline/body separator rules
} as const;

// ─── Photography ────────────────────────────────────────────────────────────
// Full-bleed treated stock photography (Pexels/Unsplash/Pixabay). While a
// photo file is missing, src is null and the PhotoLayer renders the
// code-built Jaipur backdrop instead — drop the file into public/photos/,
// set src, and the treatment pipeline applies unchanged.
// Treatment (PhotoLayer): saturate(0.25) → #0B1320 multiply 60% →
// #0B53FF colour-dodge corner 12% → grain → Ken Burns 1.00→1.06.
export const PHOTOS: Record<
  string,
  { src: string | null; credit: string | null }
> = {
  // All five supplied by the client in-chat — source and licence to be
  // confirmed before publication (see CREDITS.md).
  hawaMahal: { src: "photos/01-hawa-mahal.webp", credit: "Supplied by client — source/licence TBC" },
  rickshaw: { src: "photos/02-rickshaw.webp", credit: "Supplied by client — source/licence TBC" },
  monumentDawn: { src: "photos/03-monument.webp", credit: "Supplied by client — source/licence TBC" },
  market: { src: "photos/04-market.webp", credit: "Supplied by client — source/licence TBC" },
  walking: { src: "photos/05-walking.webp", credit: "Supplied by client — source/licence TBC" },
  handsPhone: { src: null, credit: null }, // never delivered — S7 stays type-led
};

export const PHOTO_TREATMENT = {
  saturation: 0.25,
  navyMultiplyOpacity: 0.6,
  dodgeOpacity: 0.12,
  kenBurnsFrom: 1.0,
  kenBurnsTo: 1.06,
  grainOpacity: 0.06,
} as const;

// ─── The hook (S1) ──────────────────────────────────────────────────────────
export const HOOK = {
  headlineLands: 20, // "Feel secure." fully seated by 0.8s (frame 24)
  sweepStart: 2, // something moves within the first 10 frames
  sweepEnd: 12,
  headline: "Feel secure.",
} as const;

// ─── Scene boundaries ───────────────────────────────────────────────────────
// Cuts sit at the midpoint of each measured inter-sentence pause.
export const SCENES = {
  s1: { start: 0, duration: 192 }, // thesis
  s2: { start: 192, duration: 212 }, // problem
  s3: { start: 404, duration: 208 }, // Jaipur
  s4: { start: 612, duration: 152 }, // honesty / in development
  s5: { start: 764, duration: 401 }, // five features
  s6: { start: 1165, duration: 269 }, // promise
  s7: { start: 1434, duration: 242 }, // URL
  s8: { start: 1676, duration: 130 }, // wordmark
} as const;

export type SceneKey = keyof typeof SCENES;
export const SCENE_ORDER: SceneKey[] = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
];

// ─── Per-scene visual metadata ──────────────────────────────────────────────
// numeral: the counting chapter numeral (Defect 4 — it counts 01→08).
// glow: large soft #0B53FF radial, position in %, drifts to driftTo over the
// scene (Defect 6 — positioned differently per scene).
// exitDir: which way content leaves (opposite to its entrance direction).
export const SCENE_META: Record<
  SceneKey,
  {
    numeral: string;
    glow: { x: number; y: number; driftTo: { x: number; y: number } };
    exitDir: { x: number; y: number };
  }
> = {
  s1: { numeral: "01", glow: { x: 78, y: 22, driftTo: { x: 70, y: 30 } }, exitDir: { x: 0, y: -40 } },
  s2: { numeral: "02", glow: { x: 18, y: 78, driftTo: { x: 28, y: 68 } }, exitDir: { x: -50, y: 0 } },
  s3: { numeral: "03", glow: { x: 82, y: 62, driftTo: { x: 72, y: 72 } }, exitDir: { x: 0, y: 40 } },
  s4: { numeral: "04", glow: { x: 50, y: 16, driftTo: { x: 56, y: 26 } }, exitDir: { x: 50, y: 0 } },
  s5: { numeral: "05", glow: { x: 14, y: 40, driftTo: { x: 24, y: 50 } }, exitDir: { x: 0, y: -40 } },
  s6: { numeral: "06", glow: { x: 50, y: 55, driftTo: { x: 50, y: 45 } }, exitDir: { x: 0, y: 0 } }, // exits via the cinematic zoom
  s7: { numeral: "07", glow: { x: 74, y: 30, driftTo: { x: 64, y: 40 } }, exitDir: { x: 0, y: 40 } },
  s8: { numeral: "08", glow: { x: 50, y: 38, driftTo: { x: 50, y: 42 } }, exitDir: { x: 0, y: 0 } }, // no exit — ends still
};

export const GLOW = {
  opacity: 0.2, // 18–22% band
  widthPct: 90,
  heightPct: 52,
} as const;

export const GHOST_NUMERAL_OPACITY = 0.08;

// ─── Sync beats (absolute frames, measured from the VO) ─────────────────────
export const BEATS = {
  s1VoiceStart: 0,
  s2VoiceStart: 209,
  s2TextLands: 254, // "inflated fares" is voiced 8.44–11.48s
  s3VoiceStart: 419,
  s3HeadlineLands: 425, // on "building"
  s3JaipurPin: 570, // "Jaipur" syllable ≈ 19.0s
  s4VoiceStart: 626,
  s4HeadlineLands: 640, // under "currently in development" (20.85–22.60s)
  s5VoiceStart: 779,
  s5HeadlineLands: 790, // "we have packed the essentials…"
  s5HeadlineGone: 880, // dissolved before the list ignites
  s6VoiceStart: 1180,
  s6Crossfade: 1295, // market → walking, just before "you deserve" (43.64s)
  s6TextLands: 1310, // "clear answers" is voiced 43.64–45.27s
  s7VoiceStart: 1449, // "Visit sahvoapp.com" — URL must be seated by here
  s7RuleDone: 1500,
  s8VoiceStart: 1691, // "This is only our first step."
  s8LogoIn: 1741, // logo entrance begins in the pause before "Welcome"
  s8AllStill: 1770, // fully settled — the final 1.2s hold the logo unmoving
} as const;

// ─── Sentence 5 — feature onsets (measured speech-segment starts) ───────────
export const S5_FEATURES = [
  { label: "OFFLINE SOS", icon: "sos", at: 909 },
  { label: "VERIFIED GUIDES", icon: "guides", at: 970 },
  { label: "PRICE TRANSPARENCY", icon: "price", at: 1018 },
  { label: "SAFETY ALERTS", icon: "alerts", at: 1069 },
  { label: "MULTILINGUAL SUPPORT", icon: "languages", at: 1109 },
] as const;

// ─── Motion vocabulary ──────────────────────────────────────────────────────
export const MOTION = {
  enterFrames: 20, // standard element entrance length
  charStaggerFrames: 1.2, // 40ms per character
  swapSettleFrames: 6, // S5 screenshot swap scale-settle
  breathePx: 5, // panels breathe ±5px (10px travel)
  breathePeriod: 90, // frames per breath cycle
  driftPx: 30, // screenshot drift distance over a scene
  railFillFrames: 10, // one rail segment filling
  exitFrames: 14, // content leaves in the last frames of a scene
  sweepFrames: 16, // brand rule sweeping the frame at each cut
  iconDrawFrames: 20, // feature line icons drawing on
  zoomFrames: 22, // the single cinematic zoom into the URL frame
} as const;

// ─── Copy — every on-screen string ──────────────────────────────────────────
// None of these duplicate a full narrated sentence.
// The editorial second lines EXTEND the narration — they never restate the
// voiced sentence, and they carry no launch language, no emergency-service
// implication, and no statistics.
export const COPY = {
  s1Kicker: "A TRUST LAYER OVER INDIAN TRAVEL",
  s1Editorial: "Everyone travels better with a local. Most people don't have one.",
  s2Kicker: "THE PROBLEM",
  s2Headline: "The fare gap.",
  s2Editorial: "Quoted price. Meter price. Two different numbers.",
  s2BarQuoted: "QUOTED",
  s2BarMeter: "METER",
  s3Headline: "Starting here.",
  s3Editorial: "One city. Done properly, before anywhere else.",
  s3PilotLabel: "PILOT · JAIPUR",
  s4Kicker: "STATUS",
  s4Headline: "In development.",
  s4Body: "Building openly. No launch yet.",
  s6Headline: "Clear answers.",
  s6Editorial: "Before you commit, not after you've argued.",
  s7Url: "sahvoapp.com",
  s7Mono: "FOLLOW THE BUILD",
  s8Mono: "JAIPUR PILOT · HINDI + ENGLISH · 2026",
} as const;

/** Convert an absolute beat to a scene-relative frame. */
export const rel = (absFrame: number, scene: { start: number }): number =>
  absFrame - scene.start;
