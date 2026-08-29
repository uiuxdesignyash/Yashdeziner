import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, COPY, LAYOUT, TYPE } from "../constants";
import { breathe, easeOut } from "../components/motion";
import { BrandMark, DrawRule, HeadlineLines, Kicker } from "../components/text";

// Voice: "Travel in India should not require knowing a local…" (0–5.86s)
// Type-led, restrained. The headline inverts the sentence, never repeats it.
export const S1Thesis: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      <BrandMark
        enterAt={0}
        style={{
          position: "absolute",
          top: LAYOUT.marginY,
          left: LAYOUT.marginX,
        }}
      />

      {/* Ghosted tone-on-tone numeral — structure for the upper half */}
      <div
        style={{
          position: "absolute",
          top: 250,
          right: LAYOUT.marginX,
          fontFamily: "Figtree",
          fontWeight: 800,
          fontSize: 420,
          lineHeight: 1,
          color: COLORS.raised,
          opacity: interpolate(frame, [6, 30], [0, 0.55], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          }),
          translate: `0px ${breathe(frame, 60) * 1.6}px`,
        }}
      >
        01
      </div>

      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          right: LAYOUT.marginX,
          top: HEADLINE_TOP,
          translate: `0px ${breathe(frame)}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -56,
            borderRadius: 40,
            backgroundColor: COLORS.surface,
            opacity: interpolate(frame, [0, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
            translate: interpolate(frame, [0, 20], ["0px 40px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
          }}
        />
        <div style={{ position: "relative" }}>
          <Kicker text={COPY.s1Kicker} enterAt={4} size={TYPE.monoSmall} />
          <DrawRule
            enterAt={10}
            drawFrames={50}
            width={240}
            style={{ marginTop: 24, marginBottom: LAYOUT.blockGap }}
          />
          <HeadlineLines lines={COPY.s1Headline} enterAt={8} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const HEADLINE_TOP = 760;
