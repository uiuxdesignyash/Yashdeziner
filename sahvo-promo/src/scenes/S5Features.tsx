import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  BEATS,
  COLORS,
  COPY,
  LAYOUT,
  MOTION,
  S5_FEATURES,
  SCENES,
  SCREENSHOTS,
  TYPE,
  rel,
} from "../constants";
import { easeOut } from "../components/motion";
import { FONTS } from "../fonts";
import { FeatureIcon } from "../components/FeatureIcon";
import { SceneShell } from "../components/SceneShell";
import { HeadlineLines } from "../components/text";

// Voice: "…offline SOS, verified guides, price transparency, safety alerts,
// and multilingual support." (25.96–38.32s)
//
// ENTRANCE: clip-path reveal on the window, bottom-up. EXIT: up.
// One held composition — the window frame never moves; its CONTENT
// hard-swaps on each measured feature onset, a label row illuminates with
// its line icon drawing on, and each rail tick fills as it is named.
export const S5Features: React.FC = () => {
  const frame = useCurrentFrame();
  const headlineAt = rel(BEATS.s5HeadlineLands, SCENES.s5);
  const headlineGone = rel(BEATS.s5HeadlineGone, SCENES.s5);
  const onsets = S5_FEATURES.map((f) => rel(f.at, SCENES.s5));

  // Index of the feature currently voiced; -1 during the preamble.
  const activeIndex = onsets.reduce(
    (acc, onset, i) => (frame >= onset ? i : acc),
    -1,
  );

  const shownFeature = S5_FEATURES[Math.max(activeIndex, 0)];
  const shot = SCREENSHOTS[shownFeature.screenshot];
  const beatStart = activeIndex === -1 ? 0 : onsets[activeIndex];
  const beatFrame = frame - beatStart;

  // The last swap where the image actually changed (missing captures hold
  // the previous shot, so identical sources must not re-trigger the settle).
  let lastSrcChange = 0;
  for (let i = 0; i <= activeIndex; i++) {
    const prev = i === 0 ? null : SCREENSHOTS[S5_FEATURES[i - 1].screenshot].src;
    if (SCREENSHOTS[S5_FEATURES[i].screenshot].src !== prev) {
      lastSrcChange = onsets[i];
    }
  }
  const settle = interpolate(
    frame - lastSrcChange,
    [0, MOTION.swapSettleFrames],
    [1.06, 1.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  // Slow drift inside the mask, direction alternating per feature beat.
  const driftDir = activeIndex % 2 === 0 ? 1 : -1;
  const drift = Math.min(beatFrame, 70) * 0.35;

  const windowReveal = interpolate(frame, [0, 22], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill>
      <SceneShell sceneKey="s5" numeralTop={880} numeralRight={30}>
        {/* Persistent portrait window — the frame itself never moves */}
        <div
          style={{
            position: "absolute",
            left: LAYOUT.windowX,
            top: WINDOW_TOP,
            width: LAYOUT.windowW,
            height: WINDOW_H,
            borderRadius: LAYOUT.windowRadius,
            overflow: "hidden",
            backgroundColor: COLORS.surface,
            border: `1px solid ${COLORS.raised}`,
            boxShadow: "0 40px 80px rgba(0, 0, 0, 0.45)",
            clipPath: `inset(${windowReveal}% 0 0 0 round ${LAYOUT.windowRadius}px)`,
          }}
        >
          <Img
            src={staticFile(shot.src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "32% 38%",
              // Base zoom sits 6% under the file's cap so the 1.06→1.03
              // settle animates without ever exceeding maxZoom.
              scale: String(shot.maxZoom * 0.94 * settle),
              translate: `${driftDir * drift}px ${-drift * 0.5}px`,
            }}
          />

          {/* Preamble headline on a scrim, gone before the list ignites */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "48px 64px",
              background: `linear-gradient(transparent, ${COLORS.canvas}E6)`,
              opacity: interpolate(frame, [headlineAt - 4, headlineAt], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <HeadlineLines
              lines={COPY.s5Headline}
              enterAt={headlineAt}
              exitAt={headlineGone}
            />
          </div>
        </div>

        {/* Five label rows: rail tick fills, icon draws, label illuminates */}
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
                  opacity: interpolate(frame, [8 + i * 3, 26 + i * 3], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: easeOut,
                  }),
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
      </SceneShell>
    </AbsoluteFill>
  );
};

const WINDOW_TOP = 180;
const WINDOW_H = 660;
const STACK_TOP = 900;
const ROW_H = 72;
const ROW_GAP = 18;
