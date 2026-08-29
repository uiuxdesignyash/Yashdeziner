import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants";

// A thermal fare slip as a PHYSICAL OBJECT — warm paper stock, fibre
// texture, tonal bands, a scalloped torn edge with fibre fringe, thickness
// on the light-away sides, a slight taper and bow, two shadows, and a
// printing animation with a travelling print-head line and feed jitter.
// Line items stay abstract: dashes and blocks, nothing readable.

const PAPER = "#F7F5F0"; // warm paper — deliberately not the type colour
const PAPER_EDGE = "#E2DED6"; // thickness on right/bottom (light from upper-left)
const PAPER_FRINGE = "#FDFCFA"; // torn-fibre fringe
const PAPER_BAND = "#EAE6DC"; // faint stock bands
const PRINT_INK = "#2A3648"; // thermal print grey-blue

const ROWS = [
  { left: 0.52, right: 0.16 },
  { left: 0.36, right: 0.22 },
  { left: 0.46, right: 0.14 },
  { left: 0.3, right: 0.2 },
  { left: 0.42, right: 0.16 },
  { left: 0.34, right: 0.22 },
  { left: 0.48, right: 0.14 },
  { left: 0.5, right: 0.24 },
];

const ROW_H = 60;
const HEAD_H = 104;
const FOOT_H = 46;

// Deterministic per-scallop depth variance — perfect repetition is what
// makes a tear look drawn.
const SCALLOP_DEPTHS = [3, -2, 2, -3, 1, 3, -1, 2, 0, -2, 3, 1, -3, 2, 0, -1, 3, -2, 1, 2];

const scallopEdge = (w: number, y: number, reverse: boolean): string => {
  const n = 22;
  const step = (w - 8) / n;
  let d = "";
  for (let i = 0; i < n; i++) {
    const depth = 5 + SCALLOP_DEPTHS[i % SCALLOP_DEPTHS.length] * 0.8;
    const from = reverse ? w - 4 - i * step : 4 + i * step;
    const to = reverse ? from - step : from + step;
    // Semicircular cut INTO the paper (concave), depth varying per scallop.
    d += ` A ${step / 2} ${depth} 0 0 ${reverse ? 1 : 0} ${to} ${y}`;
  }
  return d;
};

const paperPath = (w: number, h: number): string => {
  // Top edge 4px narrower than the middle; long edges bow outward slightly.
  return (
    `M6 8 Q${w / 2} 0 ${w - 6} 8` +
    ` Q${w + 4} ${h * 0.55} ${w - 4} ${h}` +
    scallopEdge(w, h, true) +
    ` Q-4 ${h * 0.55} 6 8 Z`
  );
};

export const ReceiptPaper: React.FC<{
  startAt: number;
  printFrames: number;
  width: number;
  style?: React.CSSProperties;
}> = ({ startAt, printFrames, width, style }) => {
  const frame = useCurrentFrame();
  const totalH = HEAD_H + ROWS.length * ROW_H + FOOT_H;

  const printed = interpolate(
    frame,
    [startAt, startAt + printFrames],
    [HEAD_H * 0.7, totalH],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const advancing = frame >= startAt && frame <= startAt + printFrames;

  // Thermal feed is not smooth — 1–2px vertical jitter while advancing.
  const jitter = advancing ? (((frame * 7) % 5) - 2) * 0.7 : 0;

  // Print-head line rides the leading edge, fades once the sheet stops.
  const headOpacity = advancing
    ? 0.55
    : interpolate(frame, [startAt + printFrames, startAt + printFrames + 12], [0.55, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const h = printed;

  return (
    <div
      style={{
        // Two shadows: tight contact + wide soft, following the paper shape.
        filter:
          "drop-shadow(0 3px 8px rgba(0,0,0,0.22)) drop-shadow(0 24px 48px rgba(0,0,0,0.12))",
        translate: `0px ${jitter}px`,
        ...style,
      }}
    >
      <svg
        width={width}
        height={totalH + 20}
        viewBox={`-8 -4 ${width + 16} ${totalH + 24}`}
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          {/* Paper-fibre noise */}
          <filter id="paperFibre" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 0.6 0" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
          <clipPath id="paperClip">
            <path d={paperPath(width, h)} />
          </clipPath>
        </defs>

        {/* Paper body */}
        <path d={paperPath(width, h)} fill={PAPER} />

        <g clipPath="url(#paperClip)">
          {/* Faint horizontal tonal bands in the stock */}
          {[0.24, 0.55, 0.8].map((t, i) => (
            <rect
              key={i}
              x={0}
              y={totalH * t}
              width={width}
              height={14 + i * 4}
              fill={PAPER_BAND}
              opacity={0.22}
            />
          ))}
          {/* Fibre texture at ~4% */}
          <rect x={0} y={0} width={width} height={totalH} filter="url(#paperFibre)" opacity={0.04} />

          {/* Header: brand dot + abstract title bar + dashed separator */}
          <circle cx={44} cy={44} r={11} fill={COLORS.brand} />
          <rect x={68} y={37} width={width * 0.4} height={13} rx={6.5} fill={PRINT_INK} opacity={0.75} />
          <line
            x1={30}
            y1={78}
            x2={width - 30}
            y2={78}
            stroke={PRINT_INK}
            strokeWidth={2.5}
            strokeDasharray="8 8"
            opacity={0.35}
          />

          {/* Abstract line items — printed only once the paper has advanced past them */}
          {ROWS.map((row, i) => {
            const rowY = HEAD_H + i * ROW_H + ROW_H / 2;
            if (printed < rowY + 14) return null;
            const last = i === ROWS.length - 1;
            return (
              <g key={i}>
                <rect
                  x={30}
                  y={rowY - 5}
                  width={width * row.left * 0.62}
                  height={9}
                  rx={4.5}
                  fill={PRINT_INK}
                  opacity={0.5}
                />
                <rect
                  x={width - 30 - width * row.right * 0.62}
                  y={rowY - 6}
                  width={width * row.right * 0.62}
                  height={11}
                  rx={5.5}
                  fill={last ? COLORS.brand : PRINT_INK}
                  opacity={last ? 0.92 : 0.62}
                />
              </g>
            );
          })}
        </g>

        {/* Thickness: darker 2px edge on right and bottom only */}
        <path
          d={`M${width - 6} 8 Q${width + 4} ${h * 0.55} ${width - 4} ${h}`}
          stroke={PAPER_EDGE}
          strokeWidth={2.5}
          fill="none"
        />
        <path
          d={`M${width - 4} ${h}${scallopEdge(width, h, true)}`}
          stroke={PAPER_EDGE}
          strokeWidth={2.5}
          fill="none"
        />
        {/* Torn-fibre fringe: 1px lighter line riding just above the tear */}
        <path
          d={`M${width - 4} ${h - 1.5}${scallopEdge(width, h - 1.5, true)}`}
          stroke={PAPER_FRINGE}
          strokeWidth={1.2}
          fill="none"
          opacity={0.9}
        />

        {/* Print head travelling with the leading edge */}
        <line
          x1={2}
          y1={h - 4}
          x2={width - 2}
          y2={h - 4}
          stroke={PRINT_INK}
          strokeWidth={2}
          opacity={headOpacity}
        />
      </svg>
    </div>
  );
};
