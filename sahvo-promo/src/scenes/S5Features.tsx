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
import { HeadlineLines } from "../components/text";

// Voice: "…offline SOS, verified guides, price transparency, safety alerts,
// and multilingual support." (25.96–38.32s)
//
// One held composition — five scene changes would flicker at 40 frames a beat.
// The window frame never moves; its CONTENT hard-swaps on each measured
// feature onset, a label row illuminates, and a 5-segment rail fills.
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

  // Each swap lands with a 6-frame scale settle instead of a bare blink.
  const settle = interpolate(
    beatFrame,
    [0, MOTION.swapSettleFrames],
    [1.06, 1.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  // Slow drift inside the mask, direction alternating per feature.
  const driftDir = activeIndex % 2 === 0 ? 1 : -1;
  const drift = Math.min(beatFrame, 70) * 0.35;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      {/* Persistent portrait window — the frame itself never moves */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.windowX,
          top: LAYOUT.marginY,
          width: LAYOUT.windowW,
          height: WINDOW_H,
          borderRadius: LAYOUT.windowRadius,
          overflow: "hidden",
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.raised}`,
          boxShadow: "0 40px 80px rgba(0, 0, 0, 0.45)",
          opacity: interpolate(frame, [0, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          }),
        }}
      >
        <Img
          src={staticFile(shot.src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 30%",
            // Base zoom sits 6% under the file's cap so the 1.06→1.03 settle
            // animates without ever exceeding maxZoom.
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
            padding: "56px 64px",
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

      {/* Five label rows; each rail segment fills as its feature is named */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          right: LAYOUT.marginX,
          top: STACK_TOP,
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
                gap: 28,
                height: ROW_H,
                opacity: interpolate(frame, [4 + i * 3, 22 + i * 3], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: easeOut,
                }),
              }}
            >
              {/* Rail segment — fills top-down in brand blue */}
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

const WINDOW_H = 1020;
const STACK_TOP = LAYOUT.marginY + WINDOW_H + LAYOUT.blockGap; // 1200
const ROW_H = 76;
const ROW_GAP = 16;
