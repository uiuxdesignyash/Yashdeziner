/**
 * SAHVO REEL 01 — 35s brand film, DARK SYSTEM (rebuild).
 * Navy field per the brand's video language: #0B1320 base, #16233A
 * elevated panels, #1E3050 raised cards, #F4F7FC text, #0B53FF fills/
 * rules/glows only — never text. All timings live here; 30fps, 1050 frames.
 *
 * The voiceover for this script has not been generated yet — the timeline
 * follows the master prompt's per-second spec. When the VO lands in
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
  canvas: "#0B1320",
  surface: "#16233A",
  raised: "#1E3050",
  ink: "#F4F7FC",
  soft: "#8FB0FF",
  brand: "#0B53FF",
  plate: "#FFFFFF", // illustration plates carry the asset-sheet artwork
} as const;

export const R_TYPE = {
  headline: 80,
  big: 68,
  body: 40,
  mono: 26,
  monoSmall: 22,
} as const;

// Enforced absolutely: nothing (text OR panels/plates) crosses the side
// margins; text stays inside the vertical band.
export const R_LAYOUT = {
  marginX: 96,
  contentRight: R_WIDTH - 96, // 984
  textTop: 260,
  textBottom: 1460,
  ruleThickness: 3,
  railY: 1444, // 7-segment progress rail under the text band
} as const;

export const GHOST_NUMERAL = { size: 520, opacity: 0.08 } as const;

// ─── Artwork cropped from the supplied asset sheets ─────────────────────────
// public/art/*. Plate class keeps original colour on white plates; texture
// class is white→alpha so it sits on navy. Figures/names masked at source.
export const ART = {
  city: "art/city-skyline.png",
  road: "art/road.png",
  rickshaw: "art/rickshaw.png",
  guideCircle: "art/guide-circle.png",
  autoCircle: "art/auto-circle.png",
  guidePortrait: "art/guide-portrait.png",
  shield: "art/shield.png",
  fareMini: "art/fare-mini.png",
  fareCard: "art/fare-card.png",
  guideCard: "art/guide-card.png",
  phone: "art/phone.png",
  questionHero: "art/question-hero.png",
  hawaDecorative: "art/hawa-decorative.png",
  hillside: "art/hillside.png",
  clouds: "art/clouds.png",
  lmHawaMahal: "art/lm-hawamahal.png",
  lmAmberFort: "art/lm-amberfort.png",
  lmJalMahal: "art/lm-jalmahal.png",
  lmCityPalace: "art/lm-citypalace.png",
} as const;

// ─── Scene boundaries (master-prompt seconds × 30) ──────────────────────────
export const R_SCENES = {
  r1: { start: 0, duration: 120 },
  r2: { start: 120, duration: 150 },
  r3: { start: 270, duration: 210 },
  r4: { start: 480, duration: 120 },
  r5: { start: 600, duration: 180 },
  r6: { start: 780, duration: 150 },
  r7: { start: 930, duration: 120 },
} as const;

export type RSceneKey = keyof typeof R_SCENES;
export const R_ORDER: RSceneKey[] = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"];

// Per-scene glow position (%) and ghost numeral anchor.
export const R_META: Record<
  RSceneKey,
  { glow: { x: number; y: number }; numeral: string; numTop: number; numRight: number }
> = {
  r1: { glow: { x: 72, y: 22 }, numeral: "01", numTop: 240, numRight: 40 },
  r2: { glow: { x: 24, y: 70 }, numeral: "02", numTop: 900, numRight: 34 },
  r3: { glow: { x: 60, y: 30 }, numeral: "03", numTop: 260, numRight: 40 },
  r4: { glow: { x: 50, y: 60 }, numeral: "04", numTop: 950, numRight: 40 },
  r5: { glow: { x: 30, y: 25 }, numeral: "05", numTop: 1000, numRight: 34 },
  r6: { glow: { x: 70, y: 65 }, numeral: "06", numTop: 250, numRight: 40 },
  r7: { glow: { x: 50, y: 42 }, numeral: "07", numTop: 1150, numRight: 44 },
};

// ─── Beats (absolute frames) ────────────────────────────────────────────────
export const R_BEATS = {
  r1PinPulse: 34,
  r1RouteDone: 100,
  r1Text: 30,
  r2Text: 130,
  r2Rupee: 190,
  r2Guide: 215,
  r2Questions: 245,
  q1Start: 270,
  q2Start: 330,
  q3Start: 405,
  r4Text: 540,
  r5Wash: 630,
  r5Logo: 660,
  r5MeetText: 675,
  r5FareCard: 715,
  r5GuideCard: 742,
  r6PinDrop: 800, // the real glyph lands on the true Jaipur coordinate
  r6Rajasthan: 815,
  r6Expand: 845,
  r6AllIndia: 878,
  r6Text1: 800,
  r6Text2: 880,
  r7Logo: 958,
  r7Tagline: 988,
  r7Url: 1008,
  r7AllStill: 1030, // ≥0.6s clean hold to the final frame
} as const;

export const R_COPY = {
  r1: ["India is waiting", "to be explored."],
  r2: ["But sometimes, travelling", "comes with questions."],
  q1: ["How much should", "this ride cost?"],
  q2: ["Can I trust", "this guide?"],
  q3: ["What if something", "goes wrong?"],
  r4: ["What if you didn't have to", "figure it all out yourself?"],
  r5Meet: "Meet Sahvo.",
  r5Know: "Know the fare. Know the guide.",
  r5Status: "IN DEVELOPMENT · JAIPUR PILOT",
  r6a: "Starting in Jaipur.",
  r6b: "Building for India.",
  r7Tag: "Know. Go. Trust.",
  r7Follow: "FOLLOW THE JOURNEY",
  r7Url: "sahvoapp.com",
  r7Status: "IN DEVELOPMENT · JAIPUR PILOT · 2026",
} as const;
