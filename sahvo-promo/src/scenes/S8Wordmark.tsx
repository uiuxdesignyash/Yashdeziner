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
import { SceneShell } from "../components/SceneShell";
import { Kicker } from "../components/text";

// Voice: "This is only our first step. Welcome to Sahvo." (56.35–60.16s)
// ENTRANCE: glow bloom — the wordmark blooms on "Welcome" (frame 1761),
// the glow swells then settles. NO EXIT: everything is frozen by frame 1790
// and nothing resolves after the audio ends.
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

  // The bloom: glow swells past its resting point, then settles — and is
  // constant (not animating) from stillAt onwards.
  const bloom = interpolate(
    Math.min(frame, stillAt),
    [wordmarkAt, wordmarkAt + 14, stillAt],
    [0, 1, 0.45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  return (
    <AbsoluteFill>
      <SceneShell sceneKey="s8" numeralTop={280} numeralRight={44} freezeAt={stillAt}>
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
      </SceneShell>
    </AbsoluteFill>
  );
};

const WORDMARK_TOP = 800;
