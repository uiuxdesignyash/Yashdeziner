import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../fonts";
import { easeOut } from "../components/motion";
import { DotGrid } from "./assets";
import { R_COLORS, R_LAYOUT, R_TYPE } from "./constants";

/** Off-white ground with dot grid and a soft drifting blue glow. */
export const RCanvas: React.FC<{
  glowX?: number;
  glowY?: number;
  children?: React.ReactNode;
}> = ({ glowX = 70, glowY = 25, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: R_COLORS.canvas }}>
      <DotGrid opacity={0.45} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(52% 30% at ${glowX + Math.sin(frame / 90) * 4}% ${glowY}%, rgba(29, 78, 216, 0.10) 0%, transparent 70%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/** Masked upward text reveal — the film's standard entrance. */
export const RText: React.FC<{
  text: string;
  at: number;
  size?: number;
  weight?: "display" | "body";
  color?: string;
  align?: "left" | "center";
  maxWidth?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  at,
  size = R_TYPE.headline,
  weight = "display",
  color = R_COLORS.navy,
  align = "left",
  maxWidth,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div style={{ overflow: "hidden", maxWidth, ...style }}>
      <div
        style={{
          ...(weight === "display" ? FONTS.display : FONTS.body),
          fontSize: size,
          lineHeight: 1.12,
          color,
          textAlign: align,
          translate: `0px ${(1 - p) * 105}%`,
          opacity: Math.min(p * 1.6, 1),
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Small mono label, navy-soft. */
export const RMono: React.FC<{
  text: string;
  at?: number;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, at = 0, color = R_COLORS.blue, size = R_TYPE.monoSmall, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...FONTS.mono,
        fontSize: size,
        letterSpacing: "0.16em",
        color,
        opacity: interpolate(frame, [at, at + 16], [0, 1], {
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

/** Light product card shell with rise-in. */
export const RCard: React.FC<{
  at: number;
  width: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, width, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div
      style={{
        width,
        borderRadius: 32,
        backgroundColor: R_COLORS.paper,
        border: `1.5px solid ${R_COLORS.mist}`,
        boxShadow: "0 24px 60px rgba(11, 19, 32, 0.10)",
        padding: "36px 40px",
        opacity: p,
        translate: `0px ${(1 - p) * 46}px`,
        scale: String(0.97 + p * 0.03),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Abstract masked amount — the fare stays unquantified by design. */
export const MaskedAmount: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span
        style={{
          ...FONTS.display,
          fontSize: 52,
          color: R_COLORS.navy,
        }}
      >
        ₹
      </span>
      {[64, 40, 64].map((w, i) => (
        <div
          key={i}
          style={{
            width: w,
            height: 20,
            borderRadius: 10,
            backgroundColor: i === 1 ? R_COLORS.mist : R_COLORS.light,
            opacity: interpolate(frame, [at + i * 4, at + 12 + i * 4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
          }}
        />
      ))}
    </div>
  );
};

export const R_SAFE = R_LAYOUT;
