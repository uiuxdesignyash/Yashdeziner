import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  COLORS,
  LAYOUT,
  MOTION,
  S5_FEATURES,
  SCENES,
  TYPE,
  rel,
} from "../constants";
import { easeOut } from "../components/motion";
import { FONTS } from "../fonts";
import { FeatureIcon } from "../components/FeatureIcon";
import { Receipt } from "../components/graphics";

// GRAPHIC-LED — sentence 5 (25.96–38.32s).
// The receipt prints during the preamble (the price-transparency object),
// then the five feature rows illuminate on the measured onsets — rail tick
// filling, 2px line icon drawing on, label brightening.
export const S5Features: React.FC = () => {
  const frame = useCurrentFrame();
  const onsets = S5_FEATURES.map((f) => rel(f.at, SCENES.s5));

  return (
    <AbsoluteFill>
      {/* The fare slip, printing line by line */}
      <div
        style={{
          position: "absolute",
          left: (1080 - RECEIPT_W) / 2,
          top: RECEIPT_TOP,
          rotate: "-2deg",
        }}
      >
        <Receipt startAt={12} printFrames={120} width={RECEIPT_W} />
      </div>

      {/* Five feature rows */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          right: LAYOUT.marginX,
          top: STACK_TOP,
          padding: "36px 44px",
          borderRadius: 36,
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.raised}`,
          display: "flex",
          flexDirection: "column",
          gap: ROW_GAP,
          opacity: interpolate(frame, [20, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          }),
        }}
      >
        {S5_FEATURES.map((feature, i) => {
          const onset = onsets[i];
          const lit = frame >= onset;
          const fill = interpolate(
            frame,
            [onset, onset + MOTION.railFillFrames],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
          );
          return (
            <div
              key={feature.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                height: ROW_H,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: "100%",
                  borderRadius: 4,
                  backgroundColor: COLORS.raised,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${fill * 100}%`,
                    backgroundColor: COLORS.brand,
                    boxShadow: lit ? "0 0 16px rgba(11, 83, 255, 0.7)" : "none",
                  }}
                />
              </div>
              <div style={{ opacity: lit ? 1 : 0.3 }}>
                <FeatureIcon icon={feature.icon} drawAt={onset} />
              </div>
              <div
                style={{
                  ...FONTS.mono,
                  fontSize: TYPE.mono,
                  letterSpacing: "0.18em",
                  color: COLORS.ink,
                  opacity: lit ? interpolate(fill, [0, 1], [0.25, 1]) : 0.25,
                }}
              >
                {feature.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const RECEIPT_W = 560;
const RECEIPT_TOP = 280;
const STACK_TOP = 900;
const ROW_H = 72;
const ROW_GAP = 18;
