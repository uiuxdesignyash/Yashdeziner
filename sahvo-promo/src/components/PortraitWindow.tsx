import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, LAYOUT, SCREENSHOTS } from "../constants";
import { easeOut } from "./motion";

type Props = {
  screenshot: keyof typeof SCREENSHOTS;
  /** Frames over which the whole window drifts. Defaults to the scene length passed in. */
  driftOverFrames: number;
  /** Drift direction of the image inside the mask, in px. */
  driftTo: { x: number; y: number };
  /** Zoom of the image inside the mask; clamped to the file's maxZoom. */
  zoom?: number;
  /** Window entrance start (scene-relative). Pass null for no entrance. */
  enterAt?: number | null;
  objectPosition?: string;
  width?: number;
  height?: number;
  opacity?: number;
  style?: React.CSSProperties;
};

/**
 * A wide desktop capture masked into a rounded portrait window, scaled up so
 * its text has presence, drifting slowly. Never place a capture at fit-width.
 */
export const PortraitWindow: React.FC<Props> = ({
  screenshot,
  driftOverFrames,
  driftTo,
  zoom,
  enterAt = 0,
  objectPosition = "50% 30%",
  width = LAYOUT.windowW,
  height = LAYOUT.windowH,
  opacity = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const shot = SCREENSHOTS[screenshot];
  const effectiveZoom = Math.min(zoom ?? shot.maxZoom, shot.maxZoom);

  const entrance =
    enterAt === null
      ? { opacity: 1, translate: "0px 0px" }
      : {
          opacity: interpolate(frame, [enterAt, enterAt + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          }),
          translate: interpolate(
            frame,
            [enterAt, enterAt + 20],
            ["0px 60px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            },
          ),
        };

  return (
    <div
      style={{
        width,
        height,
        borderRadius: LAYOUT.windowRadius,
        overflow: "hidden",
        backgroundColor: COLORS.surface,
        border: `1px solid ${COLORS.raised}`,
        boxShadow: `0 40px 80px rgba(0, 0, 0, 0.45)`,
        opacity: entrance.opacity * opacity,
        translate: entrance.translate,
        ...style,
      }}
    >
      <Img
        src={staticFile(shot.src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          scale: String(effectiveZoom),
          translate: interpolate(
            frame,
            [0, driftOverFrames],
            ["0px 0px", `${driftTo.x}px ${driftTo.y}px`],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      />
    </div>
  );
};
