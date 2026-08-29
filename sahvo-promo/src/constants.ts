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
  url: 112, // sahvoapp.com in S7 — the largest type in the video
  wordmark: 132, // S8 closing wordmark
  display: 96, // S6 promise line
  headline: 84, // scene headlines
  body: 44, // supporting lines
  mono: 28, // kickers and labels (JetBrains Mono)
  monoSmall: 24, // absolute minimum for soft-blue mono
  brandMark: 40, // small corner mark in S1
} as const;

// ─── Layout ─────────────────────────────────────────────────────────────────
export const LAYOUT = {
  marginX: 80,
  marginY: 140,
  blockGap: 40, // minimum between text blocks
  headlineBodyGap: 64,
  windowW: 912, // portrait screenshot window
  windowH: 1020,
  windowRadius: 48,
  windowX: (WIDTH - 912) / 2, // 84 — clears the 80px margin
} as const;

// ─── Screenshots ────────────────────────────────────────────────────────────
// Real captures dropped into public/screenshots/ under these exact names.
// lowRes files must stay under 1.4× zoom or they soften.
export const SCREENSHOTS = {
  hero: { src: "screenshots/01-hero.png", maxZoom: 1.35 },
  problem: { src: "screenshots/02-problem.png", maxZoom: 1.35 },
  pilot: { src: "screenshots/03-pilot.png", maxZoom: 1.35 },
  sos: { src: "screenshots/04-sos.png", maxZoom: 1.6 },
  guides: { src: "screenshots/05-guides.png", maxZoom: 1.6 },
  price: { src: "screenshots/06-price.png", maxZoom: 1.6 },
  alerts: { src: "screenshots/07-alerts.png", maxZoom: 1.6 },
  languages: { src: "screenshots/08-languages.png", maxZoom: 1.35 },
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
  s6TextLands: 1310, // "clear answers" is voiced 43.64–45.27s
  s7VoiceStart: 1449, // "Visit sahvoapp.com" — URL must be seated by here
  s7RuleDone: 1500,
  s8VoiceStart: 1691, // "This is only our first step."
  s8Wordmark: 1761, // "Welcome" — wordmark lands on this syllable
  s8AllStill: 1790, // every animation fully settled; audio ends ≈1805
} as const;

// ─── Sentence 5 — feature onsets (measured speech-segment starts) ───────────
export const S5_FEATURES = [
  { label: "OFFLINE SOS", screenshot: "sos", at: 909 },
  { label: "VERIFIED GUIDES", screenshot: "guides", at: 970 },
  { label: "PRICE TRANSPARENCY", screenshot: "price", at: 1018 },
  { label: "SAFETY ALERTS", screenshot: "alerts", at: 1069 },
  { label: "MULTILINGUAL SUPPORT", screenshot: "languages", at: 1109 },
] as const;

// ─── Motion vocabulary ──────────────────────────────────────────────────────
export const MOTION = {
  enterFrames: 20, // standard element entrance length
  swapSettleFrames: 6, // S5 screenshot swap scale-settle
  breathePx: 5, // panels breathe ±5px (10px travel)
  breathePeriod: 90, // frames per breath cycle
  driftPx: 30, // screenshot drift distance over a scene
  railFillFrames: 10, // one rail segment filling
} as const;

// ─── Copy — every on-screen string ──────────────────────────────────────────
// None of these duplicate a full narrated sentence.
export const COPY = {
  brandName: "Sahvo",
  s1Kicker: "A TRUST LAYER OVER INDIAN TRAVEL",
  s1Headline: ["Feel secure.", "No local required."],
  s2Kicker: "THE PROBLEM",
  s2Headline: ["Inflated fares.", "Uncertainty."],
  s3Headline: ["We're building", "the fix."],
  s3PilotLabel: "PILOT · JAIPUR",
  s4Kicker: "STATUS",
  s4Headline: "In development.",
  s4Body: "Building openly. No launch yet.",
  s5Headline: ["The essentials.", "One platform."],
  s6Headline: "Clear answers.",
  s7Url: "sahvoapp.com",
  s7Mono: "FOLLOW THE BUILD",
  s8Mono: "JAIPUR PILOT · HINDI + ENGLISH · 2026",
} as const;

/** Convert an absolute beat to a scene-relative frame. */
export const rel = (absFrame: number, scene: { start: number }): number =>
  absFrame - scene.start;
