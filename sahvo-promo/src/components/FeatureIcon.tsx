import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, MOTION } from "../constants";
import { easeOut } from "./motion";

const ICON_PATHS: Record<string, string[]> = {
  // Simple 24×24 line icons, 2px stroke, drawn on as the VO names each feature.
  sos: [
    "M12 10.5 a1.5 1.5 0 1 0 0 3 a1.5 1.5 0 1 0 0 -3", // centre dot
    "M8 8 a5.7 5.7 0 0 0 0 8", // left wave
    "M16 8 a5.7 5.7 0 0 1 0 8", // right wave
  ],
  guides: [
    "M12 3 L19 6 V11 C19 16 15.5 19.5 12 21 C8.5 19.5 5 16 5 11 V6 Z", // shield
    "M9 11.5 L11.2 13.7 L15 9.3", // check
  ],
  price: [
    "M20 4 H13 L4 13 L11 20 L20 11 Z", // tag
    "M15.5 7 a1.4 1.4 0 1 0 0 2.8 a1.4 1.4 0 1 0 0 -2.8", // eyelet
  ],
  alerts: [
    "M6 16 V11 a6 6 0 0 1 12 0 v5 l1.5 2.5 H4.5 Z", // bell
    "M10 21 a2 2 0 0 0 4 0", // clapper
  ],
  languages: [
    "M4 5 h9 v7 h-6 l-3 3 Z", // bubble one
    "M15 9 h5 v6 h-1.5 l-2 2 v-2 H15 Z", // bubble two
  ],
};

/** A line icon drawing itself on from `drawAt`, stroke by stroke. */
export const FeatureIcon: React.FC<{
  icon: string;
  drawAt: number;
  size?: number;
}> = ({ icon, drawAt, size = 44 }) => {
  const frame = useCurrentFrame();
  const paths = ICON_PATHS[icon] ?? [];
  const perPath = MOTION.iconDrawFrames / paths.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: "block" }}
    >
      {paths.map((d, i) => {
        const start = drawAt + i * perPath;
        return (
          <path
            key={d}
            d={d}
            stroke={COLORS.ink}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={interpolate(
              frame,
              [start, start + perPath],
              [1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeOut,
              },
            )}
          />
        );
      })}
    </svg>
  );
};
