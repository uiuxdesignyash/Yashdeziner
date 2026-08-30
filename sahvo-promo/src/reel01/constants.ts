/**
 * SAHVO REEL 01 — the 35s light-mode brand film ("India is waiting").
 * Separate visual system from the 60s promo: off-white canvas, navy ink,
 * Sahvo Blue #1D4ED8. Every timing lives here; 30fps, 1050 frames.
 *
 * The voiceover for this script has not been generated yet — the timeline
 * follows the master prompt's per-second spec. When the VO file lands in
 * public/audio/reel01-vo.mp3, set VO_PRESENT true and re-measure beats.
 */

export const R_FPS = 30;
export const R_WIDTH = 1080;
export const R_HEIGHT = 1920;
export const R_DURATION = 35 * R_FPS; // 1050

export const VO_PRESENT = false;
export const R_VO_SRC = "audio/reel01-vo.mp3";
export const R_MUSIC_SRC = "audio/reel01-music.wav";
export const R_SFX_SRC = "audio/reel01-sfx.wav";

export const R_COLORS = {
  canvas: "#F6F7FB", // off-white
  paper: "#FFFFFF",
  mist: "#E4ECFB", // pale blue fill
  light: "#BFD3F7", // supporting light blue
  blue: "#1D4ED8", // Sahvo Blue (this film's primary)
  navy: "#0B1320", // ink + end card
  inkSoft: "rgba(11, 19, 32, 0.62)",
} as const;

export const R_TYPE = {
  headline: 84,
  big: 72,
  body: 40,
  mono: 26,
  monoSmall: 22,
} as const;

export const R_LAYOUT = {
  marginX: 96,
  textTop: 260,
  textBottom: 1460,
} as const;

// ─── Scene boundaries (master-prompt seconds × 30) ──────────────────────────
export const R_SCENES = {
  r1: { start: 0, duration: 120 }, // India is waiting
  r2: { start: 120, duration: 150 }, // the questions begin
  r3: { start: 270, duration: 210 }, // the three questions
  r4: { start: 480, duration: 120 }, // the idea
  r5: { start: 600, duration: 180 }, // meet Sahvo
  r6: { start: 780, duration: 150 }, // Jaipur → India
  r7: { start: 930, duration: 120 }, // end card
} as const;

// ─── Beats (absolute frames) ────────────────────────────────────────────────
export const R_BEATS = {
  r1PinPulse: 34,
  r1RouteDone: 100,
  r1Text: 30,
  r2Text: 140,
  r2Rupee: 190,
  r2Guide: 215,
  r2Questions: 245,
  q1Start: 270, // fare
  q2Start: 330, // guide
  q3Start: 405, // safety
  r4Text: 540,
  r5RouteIn: 600,
  r5Wash: 630,
  r5Logo: 660,
  r5MeetText: 675,
  r5Phone: 690,
  r5FareCard: 720,
  r5GuideCard: 750,
  r6Jaipur: 786,
  r6Rajasthan: 812,
  r6Expand: 840,
  r6AllIndia: 875,
  r6PullBack: 900,
  r6Text1: 800, // "Starting in Jaipur."
  r6Text2: 880, // "Building for India."
  r7Logo: 960,
  r7Tagline: 992,
  r7Url: 1020,
  r7AllStill: 1032, // hold the final frame cleanly
} as const;

export const R_COPY = {
  r1: "India is waiting to be explored.",
  r2: "But sometimes, travelling comes with questions.",
  q1: "How much should this ride cost?",
  q2: "Can I trust this guide?",
  q3: "What if something goes wrong?",
  r4a: "What if you didn't have to",
  r4b: "figure it all out yourself?",
  r5Meet: "Meet Sahvo.",
  r5Know: ["Know the fare.", "Know the guide."],
  r6a: "Starting in Jaipur.",
  r6b: "Building for India.",
  r7Tag: "Know. Go. Trust.",
  r7Follow: "FOLLOW THE JOURNEY",
  r7Url: "sahvoapp.com",
} as const;
