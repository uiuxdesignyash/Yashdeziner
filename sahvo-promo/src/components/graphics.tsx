import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, LAYOUT, TYPE } from "../constants";
import { FONTS } from "../fonts";
import { easeOut } from "./motion";

// ─── NUMBER ROLLING — vertical odometer ─────────────────────────────────────
// Each digit is its own strip sliding with neighbours visible above and
// below, landing with a slight overshoot. The glyphs are permanently
// blurred: the ROLL is the message ("climbing"), no figure is ever legible
// (no unsourced number may appear on screen).

const DIGIT_H = 110;

const DigitColumn: React.FC<{
  startAt: number;
  rollFrames: number;
  turns: number; // how many digits the strip travels
  blur: number;
}> = ({ startAt, rollFrames, turns, blur }) => {
  const frame = useCurrentFrame();
  // Overshoot: travel slightly past the landing digit, settle back — then
  // keep creeping upward so no stable figure ever forms on screen.
  const p =
    interpolate(
      frame,
      [startAt, startAt + rollFrames, startAt + rollFrames + 8],
      [0, turns + 0.35, turns],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
    ) + Math.max(0, frame - (startAt + rollFrames + 8)) * 0.015;
  const digits = Array.from({ length: 22 }, (_, i) => i % 10);
  return (
    <div
      style={{
        height: DIGIT_H * 2.4,
        width: 88,
        overflow: "hidden",
        borderRadius: 18,
        backgroundColor: COLORS.raised,
        maskImage:
          "linear-gradient(transparent 0%, black 30%, black 70%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(transparent 0%, black 30%, black 70%, transparent 100%)",
      }}
    >
      <div
        style={{
          translate: `0px ${DIGIT_H * 0.7 - p * DIGIT_H}px`,
          filter: `blur(${blur}px)`,
          opacity: 0.75,
        }}
      >
        {digits.map((d, i) => (
          <div
            key={i}
            style={{
              ...FONTS.mono,
              height: DIGIT_H,
              fontSize: 76,
              lineHeight: `${DIGIT_H}px`,
              textAlign: "center",
              color: COLORS.ink,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Odometer: React.FC<{
  startAt: number;
  style?: React.CSSProperties;
}> = ({ startAt, style }) => {
  // Rightmost column spins fastest, like a real meter.
  const cols = [
    { turns: 3, rollFrames: 70 },
    { turns: 6, rollFrames: 74 },
    { turns: 11, rollFrames: 78 },
    { turns: 17, rollFrames: 82 },
  ];
  return (
    <div style={{ display: "flex", gap: 12, ...style }}>
      {cols.map((c, i) => (
        <DigitColumn
          key={i}
          startAt={startAt + i * 2}
          rollFrames={c.rollFrames}
          turns={c.turns}
          blur={18}
        />
      ))}
    </div>
  );
};

// ─── ANIMATED BAR COMPARISON ────────────────────────────────────────────────
// Two bars growing from a shared baseline at different rates; the widening
// gap is the message. Labelled QUOTED and METER only — no numbers.
export const FareGapBars: React.FC<{
  startAt: number;
  maxWidth: number;
  style?: React.CSSProperties;
}> = ({ startAt, maxWidth, style }) => {
  const frame = useCurrentFrame();
  const grow = (to: number, extra = 0) =>
    interpolate(frame, [startAt + extra, startAt + 60 + extra], [90, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });
  const bars = [
    { label: "QUOTED", width: grow(maxWidth), color: COLORS.brand, h: 20 },
    { label: "METER", width: grow(maxWidth * 0.42, 6), color: COLORS.raised, h: 20 },
  ];
  return (
    <div style={{ borderLeft: `3px solid ${COLORS.soft}`, paddingLeft: 28, ...style }}>
      {bars.map((bar, i) => (
        <div key={bar.label} style={{ marginTop: i === 0 ? 0 : 30 }}>
          <div
            style={{
              ...FONTS.mono,
              fontSize: TYPE.monoSmall,
              letterSpacing: "0.18em",
              color: COLORS.soft,
              marginBottom: 12,
            }}
          >
            {bar.label}
          </div>
          <div
            style={{
              width: bar.width,
              height: bar.h,
              borderRadius: bar.h / 2,
              backgroundColor: bar.color,
              boxShadow:
                bar.color === COLORS.brand
                  ? "0 0 24px rgba(11, 83, 255, 0.45)"
                  : "none",
            }}
          />
        </div>
      ))}
    </div>
  );
};

// ─── LINE CHART DRAWING ─────────────────────────────────────────────────────
// A path drawing left to right with a dot at its head and a soft gradient
// fill beneath — the build-progress metaphor behind "building openly".
export const ProgressChart: React.FC<{
  startAt: number;
  drawFrames: number;
  width: number;
  height: number;
  style?: React.CSSProperties;
}> = ({ startAt, drawFrames, width, height, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [startAt, startAt + drawFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  // A rising path with believable bumps, normalised to width/height.
  const pts = [
    [0, 0.82], [0.14, 0.7], [0.26, 0.76], [0.4, 0.52], [0.53, 0.58],
    [0.68, 0.34], [0.8, 0.4], [1, 0.12],
  ];
  const path = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x * width} ${y * height}`)
    .join(" ");

  // Head position along the polyline (linear in x is close enough here).
  const headX = p * width;
  let headY = pts[pts.length - 1][1] * height;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    if (p >= x0 && p <= x1) {
      const t = (p - x0) / (x1 - x0);
      headY = (y0 + (y1 - y0) * t) * height;
      break;
    }
  }

  return (
    <svg width={width} height={height} style={{ display: "block", ...style }}>
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.brand} stopOpacity={0.28} />
          <stop offset="100%" stopColor={COLORS.brand} stopOpacity={0} />
        </linearGradient>
        <clipPath id="chartClip">
          <rect x={0} y={0} width={headX} height={height} />
        </clipPath>
      </defs>
      <g clipPath="url(#chartClip)">
        <path d={`${path} L${width} ${height} L0 ${height} Z`} fill="url(#chartFill)" />
      </g>
      <path
        d={path}
        stroke={COLORS.brand}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
      {p > 0.01 && (
        <circle
          cx={headX}
          cy={headY}
          r={10}
          fill={COLORS.ink}
          stroke={COLORS.brand}
          strokeWidth={5}
        />
      )}
    </svg>
  );
};

// ─── PAPER / RECEIPT GRAPHIC ────────────────────────────────────────────────
// A fare slip printing line by line, torn perforated bottom edge, subtle
// shadow. Line items are abstract dashes and blocks — nothing readable.
const RECEIPT_ROWS = [
  { left: 0.62, right: 0.16 },
  { left: 0.4, right: 0.22 },
  { left: 0.55, right: 0.14 },
  { left: 0.34, right: 0.2 },
  { left: 0.48, right: 0.16 },
  { left: 0.58, right: 0.24 },
];

export const Receipt: React.FC<{
  startAt: number;
  printFrames: number;
  width: number;
  style?: React.CSSProperties;
}> = ({ startAt, printFrames, width, style }) => {
  const frame = useCurrentFrame();
  const rowH = 54;
  const headH = 96;
  const totalH = headH + RECEIPT_ROWS.length * rowH + 70;
  const perRow = printFrames / (RECEIPT_ROWS.length + 1);
  const printed = interpolate(
    frame,
    [startAt, startAt + printFrames],
    [headH, totalH],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const teeth = 18;
  const toothW = width / teeth;
  const tornEdge = Array.from({ length: teeth })
    .map(
      (_, i) =>
        `${(i * toothW).toFixed(1)}px 100%, ${(i * toothW + toothW / 2).toFixed(1)}px calc(100% - 14px)`,
    )
    .join(", ");

  return (
    <div
      style={{
        width,
        height: printed,
        overflow: "hidden",
        backgroundColor: COLORS.ink,
        clipPath: `polygon(0 0, 100% 0, 100% 100%, ${tornEdge}, 0 100%)`,
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.55)",
        ...style,
      }}
    >
      {/* Header block: brand dot + abstract title bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "30px 34px 0" }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            backgroundColor: COLORS.brand,
          }}
        />
        <div
          style={{
            width: width * 0.42,
            height: 14,
            borderRadius: 7,
            backgroundColor: COLORS.surface,
            opacity: 0.85,
          }}
        />
      </div>
      <div
        style={{
          margin: "26px 34px 0",
          borderTop: `3px dashed ${COLORS.surface}`,
          opacity: 0.4,
        }}
      />
      {RECEIPT_ROWS.map((row, i) => {
        const rowAt = startAt + (i + 1) * perRow;
        const on = frame >= rowAt;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 34px",
              height: rowH,
              opacity: on ? 1 : 0,
            }}
          >
            <div
              style={{
                width: width * row.left * 0.6,
                height: 10,
                borderRadius: 5,
                backgroundColor: COLORS.surface,
                opacity: 0.55,
              }}
            />
            <div
              style={{
                width: width * row.right * 0.6,
                height: 12,
                borderRadius: 6,
                backgroundColor: i === RECEIPT_ROWS.length - 1 ? COLORS.brand : COLORS.raised,
                opacity: 0.9,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// Re-exported so scenes only import from one place for panel bounds.
export const GRAPHIC_MAX_W = LAYOUT.textRightBelowMid - LAYOUT.marginX;
