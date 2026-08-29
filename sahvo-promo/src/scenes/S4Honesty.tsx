import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, SCENES, TYPE, rel } from "../constants";
import { breathe, easeOut, pulse } from "../components/motion";
import { FONTS } from "../fonts";
import { HeadlineLines, Kicker } from "../components/text";

// Voice: "Sahvo is currently in development…" (20.85–24.98s)
// The honesty beat. "In development." lands under the exact voiced words,
// and a bar filled to 35% — holding — says "in progress" without a word.
export const S4Honesty: React.FC = () => {
  const frame = useCurrentFrame();
  const headlineAt = rel(BEATS.s4HeadlineLands, SCENES.s4);

  const barFill = interpolate(frame, [headlineAt + 10, headlineAt + 50], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          right: LAYOUT.marginX,
          top: CARD_TOP,
          padding: 72,
          borderRadius: 44,
          backgroundColor: COLORS.surface,
          translate: `0px ${breathe(frame)}px`,
          opacity: interpolate(frame, [0, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          }),
        }}
      >
        <Kicker
          text={COPY.s4Kicker}
          enterAt={6}
          style={{ marginBottom: LAYOUT.blockGap }}
        />
        <HeadlineLines lines={[COPY.s4Headline]} enterAt={headlineAt} />

        <div
          style={{
            marginTop: LAYOUT.blockGap,
            height: 10,
            borderRadius: 5,
            backgroundColor: COLORS.raised,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${barFill * 100}%`,
              height: "100%",
              borderRadius: 5,
              backgroundColor: COLORS.brand,
              boxShadow: `0 0 ${14 + pulse(frame) * 12}px rgba(11, 83, 255, ${
                0.4 + pulse(frame) * 0.3
              })`,
            }}
          />
        </div>

        <div
          style={{
            ...FONTS.body,
            fontSize: TYPE.body,
            color: COLORS.ink,
            marginTop: LAYOUT.headlineBodyGap,
            opacity: interpolate(frame, [headlineAt + 14, headlineAt + 34], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
          }}
        >
          {COPY.s4Body}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CARD_TOP = 700;
