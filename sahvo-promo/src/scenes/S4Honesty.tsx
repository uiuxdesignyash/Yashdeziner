import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, SCENES, TYPE, rel } from "../constants";
import { breathe, easeOut, pulse } from "../components/motion";
import { FONTS } from "../fonts";
import { SceneShell } from "../components/SceneShell";
import { HeadlineLines, Kicker } from "../components/text";

// Voice: "Sahvo is currently in development…" (20.85–24.98s)
// ENTRANCE: a rule draws left→right and the content follows it in.
// EXIT: right. The honesty beat — "In development." lands under the exact
// voiced words, and a bar held at 35% says "in progress" without a word.
export const S4Honesty: React.FC = () => {
  const frame = useCurrentFrame();
  const headlineAt = rel(BEATS.s4HeadlineLands, SCENES.s4);

  const ruleP = interpolate(frame, [4, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const barFill = interpolate(frame, [headlineAt + 10, headlineAt + 50], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const followIn = (at: number) => ({
    opacity: interpolate(frame, [at, at + 18], [0, 1], {
      extrapolateLeft: "clamp" as const,
      extrapolateRight: "clamp" as const,
      easing: easeOut,
    }),
    translate: interpolate(frame, [at, at + 18], ["-40px 0px", "0px 0px"], {
      extrapolateLeft: "clamp" as const,
      extrapolateRight: "clamp" as const,
      easing: easeOut,
    }),
  });

  return (
    <AbsoluteFill>
      <SceneShell sceneKey="s4" numeralTop={420} numeralRight={40}>
        <div
          style={{
            position: "absolute",
            left: LAYOUT.marginX,
            right: LAYOUT.marginX,
            top: CARD_TOP,
            padding: 72,
            borderRadius: 44,
            backgroundColor: COLORS.surface,
            border: `1px solid ${COLORS.raised}`,
            translate: `0px ${breathe(frame)}px`,
            opacity: interpolate(frame, [0, 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
          }}
        >
          {/* The leading rule the content follows */}
          <div
            style={{
              width: `${ruleP * 100}%`,
              height: LAYOUT.ruleThickness,
              backgroundColor: COLORS.brand,
              marginBottom: LAYOUT.blockGap,
              boxShadow: `0 0 ${12 + pulse(frame) * 10}px rgba(11, 83, 255, 0.4)`,
            }}
          />
          <div style={followIn(16)}>
            <Kicker text={COPY.s4Kicker} enterAt={16} />
          </div>
          <div style={{ ...followIn(headlineAt - 4), marginTop: LAYOUT.blockGap }}>
            <HeadlineLines lines={[COPY.s4Headline]} enterAt={headlineAt} />
          </div>

          <div
            style={{
              marginTop: LAYOUT.blockGap,
              height: 12,
              borderRadius: 6,
              backgroundColor: COLORS.raised,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${barFill * 100}%`,
                height: "100%",
                borderRadius: 6,
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
              ...followIn(headlineAt + 14),
            }}
          >
            {COPY.s4Body}
          </div>
        </div>
      </SceneShell>
    </AbsoluteFill>
  );
};

const CARD_TOP = 640;
