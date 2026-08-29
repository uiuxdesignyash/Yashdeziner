import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, MOTION, TYPE } from "../constants";
import { FONTS } from "../fonts";
import { easeOut, pulse } from "./motion";

/** Small mono label in soft blue — 24px minimum per the brand rules. */
export const Kicker: React.FC<{
  text: string;
  enterAt?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ text, enterAt = 0, size = TYPE.mono, color = COLORS.soft, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...FONTS.mono,
        fontSize: Math.max(size, TYPE.monoSmall),
        letterSpacing: "0.18em",
        color,
        opacity: interpolate(frame, [enterAt, enterAt + MOTION.enterFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOut,
        }),
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Headline lines springing up in a stagger. All headlines are ink. */
export const HeadlineLines: React.FC<{
  lines: readonly string[];
  enterAt?: number;
  stagger?: number;
  size?: number;
  exitAt?: number | null;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({
  lines,
  enterAt = 0,
  stagger = 6,
  size = TYPE.headline,
  exitAt = null,
  align = "left",
  style,
}) => {
  const frame = useCurrentFrame();
  const exitOpacity =
    exitAt === null
      ? 1
      : interpolate(frame, [exitAt, exitAt + 15], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOut,
        });
  return (
    <div style={{ textAlign: align, opacity: exitOpacity, ...style }}>
      {lines.map((line, i) => {
        const at = enterAt + i * stagger;
        return (
          <div
            key={line}
            style={{
              ...FONTS.display,
              fontSize: size,
              lineHeight: 1.08,
              color: COLORS.ink,
              opacity: interpolate(frame, [at, at + 22], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeOut,
              }),
              translate: interpolate(frame, [at, at + 22], ["0px 46px", "0px 0px"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeOut,
              }),
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

/** A brand-blue rule that draws to width, then keeps a breathing glow. */
export const DrawRule: React.FC<{
  enterAt: number;
  drawFrames: number;
  width: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ enterAt, drawFrames, width, height = 6, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: interpolate(frame, [enterAt, enterAt + drawFrames], [0, width], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOut,
        }),
        height,
        borderRadius: height / 2,
        backgroundColor: COLORS.brand,
        boxShadow: `0 0 ${18 + pulse(frame) * 14}px rgba(11, 83, 255, ${
          0.35 + pulse(frame) * 0.3
        })`,
        ...style,
      }}
    />
  );
};

/** The typographic Sahvo mark: ExtraBold name + brand-blue dot (a fill, not text). */
export const BrandMark: React.FC<{
  size?: number;
  enterAt?: number;
  style?: React.CSSProperties;
}> = ({ size = TYPE.brandMark, enterAt = 0, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: size * 0.12,
        opacity: interpolate(frame, [enterAt, enterAt + MOTION.enterFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOut,
        }),
        ...style,
      }}
    >
      <span style={{ ...FONTS.display, fontSize: size, color: COLORS.ink }}>
        Sahvo
      </span>
      <span
        style={{
          width: size * 0.22,
          height: size * 0.22,
          borderRadius: "50%",
          backgroundColor: COLORS.brand,
        }}
      />
    </div>
  );
};
