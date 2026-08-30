import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { easeOut } from "../components/motion";
import { R_COLORS } from "./constants";

// Code stays for what code does exactly: route lines, dots, and thin
// stroke glyphs. All illustrations come from the asset sheets (public/art).

/** A path that draws itself between two frames. */
export const DrawnPath: React.FC<{
  d: string;
  from: number;
  to: number;
  stroke?: string;
  strokeWidth?: number;
  dashed?: boolean;
}> = ({ d, from, to, stroke = R_COLORS.brand, strokeWidth = 3, dashed }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={dashed ? "0.03 0.018" : "1"}
      strokeDashoffset={dashed ? 1 - p + 0.0001 : 1 - p}
      opacity={p > 0 ? 1 : 0}
    />
  );
};

/** A location dot with an optional one-shot ripple (map-space units). */
export const MapDot: React.FC<{
  x: number;
  y: number;
  at: number;
  r?: number;
  rippleAt?: number | null;
}> = ({ x, y, at, r = 8, rippleAt = null }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [at, at + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const rip =
    rippleAt === null
      ? 1
      : interpolate(frame, [rippleAt, rippleAt + 26], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  return (
    <g>
      {rippleAt !== null && rip > 0 && rip < 1 && (
        <circle
          cx={x}
          cy={y}
          r={r + rip * 26}
          stroke={R_COLORS.brand}
          strokeWidth={2.5}
          fill="none"
          opacity={0.65 * (1 - rip)}
        />
      )}
      <circle cx={x} cy={y} r={r * pop} fill={R_COLORS.brand} />
      <circle cx={x} cy={y} r={r * 0.4 * pop} fill={R_COLORS.ink} />
    </g>
  );
};

/** Thin stroke glyphs (soft blue) that draw themselves on. */
export const LineIcon: React.FC<{
  kind: "suitcase" | "camera" | "plane" | "check";
  size?: number;
  color?: string;
  drawFrom?: number;
  drawTo?: number;
}> = ({ kind, size = 56, color = R_COLORS.soft, drawFrom = 0, drawTo = 0 }) => {
  const frame = useCurrentFrame();
  const paths: Record<string, string[]> = {
    suitcase: [
      "M5 9 h14 a2 2 0 0 1 2 2 v8 a2 2 0 0 1 -2 2 h-14 a2 2 0 0 1 -2 -2 v-8 a2 2 0 0 1 2 -2 Z",
      "M9 9 V7 a2 2 0 0 1 2 -2 h2 a2 2 0 0 1 2 2 v2",
    ],
    camera: [
      "M4 8 h4 l2 -2.5 h4 L16 8 h4 a1.5 1.5 0 0 1 1.5 1.5 v8 a1.5 1.5 0 0 1 -1.5 1.5 h-16 a1.5 1.5 0 0 1 -1.5 -1.5 v-8 A1.5 1.5 0 0 1 4 8 Z",
      "M12 10.5 a3 3 0 1 0 0 6 a3 3 0 1 0 0 -6",
    ],
    plane: ["M3 13 l18 -7 l-6 8 l1 5 l-3 -2.5 l-3.5 2 l0.8 -4 Z"],
    check: ["M8.5 12 L11 14.5 L15.7 9.4"],
  };
  const list = paths[kind];
  const perPath = drawTo > drawFrom ? (drawTo - drawFrom) / list.length : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {list.map((d, i) => {
        const start = drawFrom + i * perPath;
        const p =
          drawTo > drawFrom
            ? interpolate(frame, [start, start + perPath], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeOut,
              })
            : 1;
        return (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={p > 0 ? 1 : 0}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
        );
      })}
    </svg>
  );
};
