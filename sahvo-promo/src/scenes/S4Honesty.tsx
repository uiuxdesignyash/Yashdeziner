import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, SCENES, TYPE, rel } from "../constants";
import { breathe, easeOut } from "../components/motion";
import { FONTS } from "../fonts";
import { ProgressChart } from "../components/graphics";
import { HeadlineLines, Kicker } from "../components/text";

// TYPE-LED — sentence 4 (20.85–24.98s). The honesty beat.
// "In development." lands under the exact voiced words; the line chart draws
// left to right beneath as the build-progress metaphor.
export const S4Honesty: React.FC = () => {
  const frame = useCurrentFrame();
  const headlineAt = rel(BEATS.s4HeadlineLands, SCENES.s4); // 28

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          right: LAYOUT.marginX,
          top: CARD_TOP,
          padding: "64px 64px 56px",
          borderRadius: 44,
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.raised}`,
          translate: `0px ${breathe(frame)}px`,
          opacity: interpolate(frame, [0, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          }),
        }}
      >
        <Kicker text={COPY.s4Kicker} enterAt={8} />
        <HeadlineLines
          lines={[COPY.s4Headline]}
          enterAt={headlineAt}
          style={{ marginTop: LAYOUT.blockGap }}
        />
        <div
          style={{
            ...FONTS.body,
            fontSize: TYPE.body,
            color: COLORS.ink,
            marginTop: 32,
            opacity: interpolate(frame, [headlineAt + 12, headlineAt + 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
          }}
        >
          {COPY.s4Body}
        </div>

        <ProgressChart
          startAt={14}
          drawFrames={SCENES.s4.duration - 44}
          width={760}
          height={300}
          style={{ marginTop: LAYOUT.blockGap }}
        />
      </div>
    </AbsoluteFill>
  );
};

const CARD_TOP = 480;
