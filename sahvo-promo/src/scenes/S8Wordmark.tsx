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

// THE CLOSE — sentence 8 (56.35–60.16s).
// The wordmark blooms on "Welcome" (frame 1761): glow swells past its
// resting point and settles. Everything is frozen by frame 1790 — nothing
// resolves after the audio ends.
export const S8Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordmarkAt = rel(BEATS.s8Wordmark, SCENES.s8); // 85
  const stillAt = rel(BEATS.s8AllStill, SCENES.s8); // 114

  const mark = spring({
    frame: frame - wordmarkAt,
    fps,
    config: { damping: 200 },
    durationInFrames: stillAt - wordmarkAt - 4,
  });

  const bloom = interpolate(
    Math.min(frame, stillAt),
    [wordmarkAt, wordmarkAt + 14, stillAt],
    [0, 1, 0.45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: WORDMARK_TOP,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
              textShadow: `0 0 ${30 + bloom * 60}px rgba(11, 83, 255, ${bloom * 0.8})`,
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
              boxShadow: `0 0 ${20 + bloom * 50}px ${8 + bloom * 10}px rgba(11, 83, 255, ${
                0.35 + bloom * 0.45
              })`,
            }}
          />
        </div>

        <Kicker
          text={COPY.s8Mono}
          enterAt={0}
          size={TYPE.monoSmall}
          style={{ marginTop: 80 }}
        />
      </div>
    </AbsoluteFill>
  );
};

const WORDMARK_TOP = 800;
