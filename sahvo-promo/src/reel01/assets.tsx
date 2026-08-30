import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { easeOut } from "../components/motion";
import { R_COLORS } from "./constants";

// Code-drawn assets in the asset boards' language: soft simplified shapes,
// thin route lines, 2.5px strokes, Sahvo Blue on off-white.

// Simplified, deliberately abstract India silhouette (viewBox 0 0 560 620).
export const INDIA_PATH =
  "M212 24 Q238 8 258 26 Q276 42 296 38 Q318 34 326 54 Q332 70 352 74 " +
  "Q378 78 392 92 Q404 104 424 108 Q446 112 458 128 Q468 142 490 138 " +
  "Q512 134 518 152 Q524 172 506 182 Q488 190 478 206 Q470 220 452 216 " +
  "Q438 212 430 226 Q424 240 428 258 Q430 274 418 282 Q404 290 400 308 " +
  "Q394 336 380 362 Q362 396 344 428 Q326 460 310 492 Q294 524 278 552 " +
  "Q266 574 252 560 Q240 546 234 520 Q226 488 212 460 Q196 428 182 396 " +
  "Q168 362 158 328 Q150 300 136 288 Q116 274 100 262 Q80 248 72 228 " +
  "Q64 208 84 200 Q100 194 106 176 Q112 156 132 150 Q152 144 158 124 " +
  "Q164 102 178 86 Q192 68 196 48 Q200 32 212 24 Z";

// Rough Rajasthan region within the same viewBox.
export const RAJASTHAN_PATH =
  "M108 176 Q124 160 148 158 Q172 156 186 140 Q198 128 214 138 Q228 148 " +
  "236 166 Q244 184 238 204 Q232 224 216 236 Q198 248 178 252 Q156 256 " +
  "140 244 Q122 232 110 214 Q100 196 108 176 Z";

// Map anchor points (same viewBox): Jaipur + expansion cities.
export const MAP_POINTS = {
  jaipur: { x: 196, y: 190 },
  delhi: { x: 224, y: 150 },
  ahmedabad: { x: 128, y: 268 },
  mumbai: { x: 154, y: 342 },
  hyderabad: { x: 262, y: 388 },
  goa: { x: 178, y: 412 },
  bangalore: { x: 246, y: 470 },
  chennai: { x: 300, y: 462 },
  kolkata: { x: 398, y: 258 },
} as const;

/** A path that draws itself left-to-right between two frames. */
export const DrawnPath: React.FC<{
  d: string;
  from: number;
  to: number;
  stroke?: string;
  strokeWidth?: number;
  dashed?: boolean;
}> = ({ d, from, to, stroke = R_COLORS.blue, strokeWidth = 3, dashed }) => {
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
      strokeDasharray={dashed ? "0.035 0.02" : "1"}
      strokeDashoffset={dashed ? 1 - p + 0.0001 : 1 - p}
      opacity={p > 0 ? 1 : 0}
    />
  );
};

/** A location dot with an optional one-shot ripple. */
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
          stroke={R_COLORS.blue}
          strokeWidth={2.5}
          fill="none"
          opacity={0.65 * (1 - rip)}
        />
      )}
      <circle cx={x} cy={y} r={r * pop} fill={R_COLORS.blue} />
      <circle cx={x} cy={y} r={r * 0.4 * pop} fill={R_COLORS.paper} />
    </g>
  );
};

/** Minimal 2.5px-stroke line icons for the light film. */
export const LineIcon: React.FC<{
  kind: "suitcase" | "camera" | "plane" | "pin" | "rupee" | "shield" | "check";
  size?: number;
  color?: string;
  drawFrom?: number;
  drawTo?: number;
}> = ({ kind, size = 56, color = R_COLORS.navy, drawFrom = 0, drawTo = 0 }) => {
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
    plane: [
      "M3 13 l18 -7 l-6 8 l1 5 l-3 -2.5 l-3.5 2 l0.8 -4 Z",
    ],
    pin: [
      "M12 3 a6.5 6.5 0 0 1 6.5 6.5 C18.5 14.5 12 21 12 21 C12 21 5.5 14.5 5.5 9.5 A6.5 6.5 0 0 1 12 3 Z",
      "M12 7.2 a2.4 2.4 0 1 0 0 4.8 a2.4 2.4 0 1 0 0 -4.8",
    ],
    rupee: [
      "M7 4 h10 M7 8.4 h10 M8 4 Q13.6 4 13.6 8.4 Q13.6 12.6 8.4 12.6 L15.5 20",
    ],
    shield: [
      "M12 3 L19 6 V11 C19 16 15.5 19.5 12 21 C8.5 19.5 5 16 5 11 V6 Z",
    ],
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
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
            opacity={p > 0 ? 1 : 0}
          />
        );
      })}
    </svg>
  );
};

/** Simple side-view auto-rickshaw, boards' line style. */
export const Rickshaw: React.FC<{ size?: number; color?: string }> = ({
  size = 150,
  color = R_COLORS.navy,
}) => (
  <svg width={size} height={size * 0.72} viewBox="0 0 100 72" fill="none">
    <path
      d="M14 50 V30 Q14 18 26 16 L58 12 Q70 11 74 22 L80 38 Q88 40 88 48 v4"
      stroke={color}
      strokeWidth={3.2}
      strokeLinecap="round"
      fill="none"
    />
    <path d="M14 50 h16 M46 50 h26" stroke={color} strokeWidth={3.2} strokeLinecap="round" />
    <path d="M30 18 v30 M56 14 v36" stroke={color} strokeWidth={2.4} />
    <path d="M34 24 h18 v14 h-18 Z" fill={R_COLORS.mist} stroke={color} strokeWidth={2} />
    <circle cx={38} cy={54} r={8} stroke={color} strokeWidth={3.2} fill={R_COLORS.paper} />
    <circle cx={80} cy={56} r={7} stroke={color} strokeWidth={3.2} fill={R_COLORS.paper} />
    <circle cx={38} cy={54} r={2.4} fill={color} />
    <circle cx={80} cy={56} r={2.2} fill={color} />
  </svg>
);

/** Abstract guide avatar in a circle — no real person implied. */
export const Avatar: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={23} fill={R_COLORS.mist} />
    <circle cx={24} cy={19} r={7.5} fill={R_COLORS.blue} opacity={0.85} />
    <path d="M10 40 Q13 29 24 29 Q35 29 38 40 Z" fill={R_COLORS.blue} opacity={0.85} />
  </svg>
);

/** Faint dot grid texture. */
export const DotGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.5 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `radial-gradient(circle, ${R_COLORS.light} 1.6px, transparent 1.6px)`,
      backgroundSize: "64px 64px",
      opacity,
    }}
  />
);
