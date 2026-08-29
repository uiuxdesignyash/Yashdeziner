import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BEATS, COLORS, COPY, SCENES, TYPE, rel } from "../constants";
import { easeOut } from "../components/motion";
import { FONTS } from "../fonts";
import { Kicker } from "../components/text";

// Voice: "This is only our first step. Welcome to Sahvo." (56.35–60.16s)
// The wordmark lands exactly on "Welcome" (frame 1761) and everything is
// frozen by frame 1790 — nothing resolves after the audio ends.
export const S8Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordmarkAt = rel(BEATS.s8Wordmark, SCENES.s8); // 85
  const stillAt = rel(BEATS.s8AllStill, SCENES.s8); // 114

  // damping 200 = no overshoot; fully settled within the stillAt budget.
  const mark = spring({
    frame: frame - wordmarkAt,
    fps,
    config: { damping: 200 },
    durationInFrames: stillAt - wordmarkAt - 4,
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(110% 80% at 50% 42%, ${COLORS.surface} 0%, ${COLORS.canvas} 72%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            opacity: mark,
            scale: String(0.9 + mark * 0.1),
          }}
        >
          <span
            style={{
              ...FONTS.display,
              fontSize: TYPE.wordmark,
              color: COLORS.ink,
              letterSpacing: "-0.01em",
            }}
          >
            {COPY.brandName}
          </span>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: COLORS.brand,
              boxShadow: "0 0 30px rgba(11, 83, 255, 0.6)",
            }}
          />
        </div>

        <Kicker
          text={COPY.s8Mono}
          enterAt={0}
          size={TYPE.monoSmall}
          style={{
            marginTop: 72,
            opacity: interpolate(frame, [0, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
