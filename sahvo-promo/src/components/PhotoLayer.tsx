import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { PHOTO_TREATMENT } from "../constants";
import { JaipurBackdrop } from "./JaipurBackdrop";

// SVG film grain as a data URI — tiled, subtle, over everything.
const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="240" height="240" filter="url(#n)" opacity="0.5"/></svg>`,
)}`;

type Props = {
  /** Path under public/, or null → render the code-built Jaipur backdrop. */
  src: string | null;
  /** Frames the Ken Burns move spans (usually the scene duration). */
  overFrames: number;
  /** Which corner carries the colour-dodge accent. */
  dodgeCorner?: "tl" | "tr" | "bl" | "br";
  /** Extra dimming multiply on top of the standard treatment (0–1). */
  extraDim?: number;
  opacity?: number;
};

/**
 * Full-bleed treated photography — the background layer under type.
 * Mandatory treatment so photography reads as brand, not stock:
 * desaturate → navy multiply → one corner of colour-dodge blue →
 * slow Ken Burns (1.00→1.06) → fine grain.
 */
export const PhotoLayer: React.FC<Props> = ({
  src,
  overFrames,
  dodgeCorner = "tr",
  extraDim = 0,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(
    frame,
    [0, overFrames],
    [PHOTO_TREATMENT.kenBurnsFrom, PHOTO_TREATMENT.kenBurnsTo],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const corner = {
    tl: "20% 15%",
    tr: "80% 15%",
    bl: "20% 85%",
    br: "80% 85%",
  }[dodgeCorner];

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(scale) }}>
        {src === null ? (
          <JaipurBackdrop />
        ) : (
          <Img
            src={staticFile(src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `saturate(${PHOTO_TREATMENT.saturation})`,
            }}
          />
        )}
      </AbsoluteFill>

      {/* Navy multiply — sinks the image into the canvas. The code-built
          backdrop is already in-palette, so it takes a much lighter hand. */}
      <AbsoluteFill
        style={{
          backgroundColor: "#0B1320",
          mixBlendMode: "multiply",
          opacity:
            (src === null ? 0.18 : PHOTO_TREATMENT.navyMultiplyOpacity) +
            extraDim,
        }}
      />
      {/* One corner of colour-dodge brand blue */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at ${corner}, #0B53FF 0%, transparent 70%)`,
          mixBlendMode: "color-dodge",
          opacity: src === null ? 0.2 : PHOTO_TREATMENT.dodgeOpacity,
        }}
      />
      {/* Fine grain */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("${GRAIN}")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
          opacity: PHOTO_TREATMENT.grainOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
