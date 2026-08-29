import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, MOTION, TYPE } from "../constants";
import { FONTS } from "../fonts";
import { easeOut, power4Out, pulse } from "./motion";

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

/**
 * Character-stagger rise: each character springs up 40ms after the last,
 * power4.out. One of the rotated entrance treatments.
 */
export const CharStaggerHeadline: React.FC<{
  lines: readonly string[];
  enterAt?: number;
  size?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ lines, enterAt = 0, size = TYPE.headline, align = "left", style }) => {
  const frame = useCurrentFrame();
  let charIndex = 0;
  return (
    <div style={{ textAlign: align, ...style }}>
      {lines.map((line) => (
        <div
          key={line}
          style={{
            ...FONTS.display,
            fontSize: size,
            lineHeight: 1.08,
            color: COLORS.ink,
            whiteSpace: "pre",
          }}
        >
          {[...line].map((ch, i) => {
            const at = enterAt + charIndex * MOTION.charStaggerFrames;
            charIndex += 1;
            return (
              <span
                key={`${ch}-${i}`}
                style={{
                  display: "inline-block",
                  opacity: interpolate(frame, [at, at + 16], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: power4Out,
                  }),
                  translate: interpolate(
                    frame,
                    [at, at + 16],
                    ["0px 34px", "0px 0px"],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: power4Out,
                    },
                  ),
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/**
 * Editorial second line: says what the voice is NOT saying. One line of
 * 6–12 words, Figtree Regular ~34px, ink at 78%, 40px below its headline.
 */
export const Editorial: React.FC<{
  text: string;
  enterAt: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ text, enterAt, align = "left", style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...FONTS.body,
        fontSize: TYPE.editorial,
        lineHeight: 1.5,
        color: COLORS.ink,
        textAlign: align,
        opacity:
          0.78 *
          interpolate(frame, [enterAt, enterAt + 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          }),
        translate: interpolate(frame, [enterAt, enterAt + 18], ["0px 24px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOut,
        }),
        marginTop: 40,
        ...style,
      }}
    >
      {text}
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
}> = ({ enterAt, drawFrames, width, height = 3, style }) => {
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
