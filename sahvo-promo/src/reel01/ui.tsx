import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONTS } from "../fonts";
import { easeOut } from "../components/motion";
import {
  GHOST_NUMERAL,
  R_COLORS,
  R_LAYOUT,
  R_META,
  R_ORDER,
  R_SCENES,
  R_TYPE,
  RSceneKey,
} from "./constants";

/**
 * Dark ground: navy canvas, slow-drifting dot layer at ~7%, a large brand
 * glow at 20% positioned per scene, and the scene's ghost index numeral.
 */
export const RCanvas: React.FC<{
  scene: RSceneKey;
  children?: React.ReactNode;
}> = ({ scene, children }) => {
  const frame = useCurrentFrame();
  const meta = R_META[scene];
  return (
    <AbsoluteFill style={{ backgroundColor: R_COLORS.canvas }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle, ${R_COLORS.soft} 1.5px, transparent 1.5px)`,
          backgroundSize: "72px 72px",
          backgroundPosition: `${frame * 0.1}px ${frame * 0.07}px`,
          opacity: 0.07,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(80% 46% at ${meta.glow.x + Math.sin(frame / 90) * 3}% ${meta.glow.y}%, rgba(11, 83, 255, 0.2) 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: meta.numTop,
          right: meta.numRight,
          ...FONTS.display,
          fontSize: GHOST_NUMERAL.size,
          lineHeight: 1,
          color: R_COLORS.ink,
          opacity: GHOST_NUMERAL.opacity,
          translate: `0px ${Math.sin(frame / 90) * 4}px`,
        }}
      >
        {meta.numeral}
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Persistent 7-segment progress rail under the text band. */
export const ReelRail: React.FC = () => {
  const frame = useCurrentFrame();
  const gap = 10;
  const total = R_LAYOUT.contentRight - R_LAYOUT.marginX;
  const segW = (total - gap * (R_ORDER.length - 1)) / R_ORDER.length;
  return (
    <div
      style={{
        position: "absolute",
        left: R_LAYOUT.marginX,
        top: R_LAYOUT.railY,
        display: "flex",
        gap,
      }}
    >
      {R_ORDER.map((key) => {
        const s = R_SCENES[key];
        const fill = interpolate(frame, [s.start, s.start + s.duration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={key}
            style={{
              width: segW,
              height: 6,
              borderRadius: 3,
              backgroundColor: R_COLORS.raised,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${fill * 100}%`,
                backgroundColor: R_COLORS.brand,
                opacity: 0.9,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/** Masked upward text reveal — ink on navy, the film's standard entrance. */
export const RText: React.FC<{
  lines: readonly string[];
  at: number;
  size?: number;
  align?: "left" | "center";
  color?: string;
  style?: React.CSSProperties;
}> = ({ lines, at, size = R_TYPE.headline, align = "left", color = R_COLORS.ink, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={style}>
      {lines.map((line, i) => {
        const p = interpolate(frame, [at + i * 6, at + i * 6 + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOut,
        });
        return (
          <div key={line} style={{ overflow: "hidden" }}>
            <div
              style={{
                ...FONTS.display,
                fontSize: size,
                lineHeight: 1.12,
                color,
                textAlign: align,
                translate: `0px ${(1 - p) * 105}%`,
                opacity: Math.min(p * 1.6, 1),
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const RMono: React.FC<{
  text: string;
  at?: number;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, at = 0, color = R_COLORS.soft, size = R_TYPE.monoSmall, style }) => {
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

/** Elevated surface panel behind text blocks, with 3px brand rule. */
export const TextPanel: React.FC<{
  at: number;
  top: number;
  children: React.ReactNode;
  rule?: boolean;
}> = ({ at, top, children, rule = true }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: R_LAYOUT.marginX,
        width: R_LAYOUT.contentRight - R_LAYOUT.marginX,
        top,
        padding: "36px 44px",
        borderRadius: 36,
        backgroundColor: R_COLORS.surface,
        border: `1px solid ${R_COLORS.raised}`,
        opacity: p,
        translate: `0px ${(1 - p) * 30 + Math.sin(frame / 90) * 4}px`,
        boxSizing: "border-box",
      }}
    >
      {rule && (
        <div
          style={{
            width: interpolate(frame, [at + 8, at + 34], [0, 150], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
            height: R_LAYOUT.ruleThickness,
            borderRadius: 2,
            backgroundColor: R_COLORS.brand,
            marginBottom: 24,
          }}
        />
      )}
      {children}
    </div>
  );
};

/** Light illustration plate carrying asset-sheet artwork, object treatment. */
export const Plate: React.FC<{
  art: string;
  at: number;
  left: number;
  top: number;
  width: number;
  tilt?: number;
  circle?: boolean;
  pad?: number;
}> = ({ art, at, left, top, width, tilt = 0, circle, pad = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        padding: pad,
        borderRadius: circle ? "50%" : 30,
        overflow: "hidden",
        backgroundColor: R_COLORS.plate,
        boxShadow:
          "0 3px 8px rgba(0,0,0,0.3), 0 26px 54px rgba(0,0,0,0.28)",
        rotate: `${tilt}deg`,
        opacity: p,
        translate: `0px ${(1 - p) * 40}px`,
        scale: String(0.96 + p * 0.04),
        lineHeight: 0,
      }}
    >
      <Img src={staticFile(art)} style={{ width: "100%" }} />
    </div>
  );
};
