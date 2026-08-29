import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts/ so renders need no network access.
// Figtree ships as a variable font — one file covers Regular (400) and
// ExtraBold (800).
const loading = Promise.all([
  loadFont({
    family: "Figtree",
    url: staticFile("fonts/Figtree-latin-var.woff2"),
    weight: "300 900",
  }),
  loadFont({
    family: "JetBrains Mono",
    url: staticFile("fonts/JetBrainsMono-500-latin.woff2"),
    weight: "500",
  }),
]);

export const fontsReady = loading;

export const FONTS = {
  display: { fontFamily: "Figtree", fontWeight: 800 },
  body: { fontFamily: "Figtree", fontWeight: 400 },
  mono: { fontFamily: "JetBrains Mono", fontWeight: 500 },
} as const;
