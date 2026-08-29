import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, MOTION, SCENES, TYPE, rel } from "../constants";
import { breathe, easeOut } from "../components/motion";
import { FONTS } from "../fonts";
import { DrawRule, Kicker } from "../components/text";

// TYPE-LED — sentence 7 (48.29–55.40s).
// The single cinematic zoom of the video carries the cut in; the URL sits
// at the vertical centre where no caption overlay can cover it, fully
// seated the moment the voice says it.
export const S7Url: React.FC = () => {
  const frame = useCurrentFrame();
  const voiceAt = rel(BEATS.s7VoiceStart, SCENES.s7); // 15
  const ruleDone = rel(BEATS.s7RuleDone, SCENES.s7);

  const zoomP = interpolate(frame, [0, MOTION.zoomFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          scale: String(1.22 - zoomP * 0.22),
          opacity: zoomP,
        }}
      >
        {/* Concentric rings widening slowly behind the card */}
        {[520, 780, 1060].map((d, i) => (
          <div
            key={d}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: d,
              height: d,
              marginLeft: -d / 2,
              marginTop: -d / 2,
              borderRadius: "50%",
              border: `1px solid ${COLORS.raised}`,
              scale: String(
                1 + interpolate(frame, [0, SCENES.s7.duration], [0, 0.1]) + i * 0.02,
              ),
              opacity: 0.7,
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            left: LAYOUT.marginX,
            right: LAYOUT.marginX,
            top: CARD_TOP,
            padding: "80px 64px",
            borderRadius: 44,
            backgroundColor: COLORS.raised,
            border: `1px solid ${COLORS.surface}`,
            boxShadow: "0 40px 90px rgba(0, 0, 0, 0.5)",
            translate: `0px ${breathe(frame, 20)}px`,
          }}
        >
          <div
            style={{
              ...FONTS.display,
              fontSize: TYPE.url,
              color: COLORS.ink,
              letterSpacing: "-0.01em",
            }}
          >
            {COPY.s7Url}
          </div>
          <DrawRule
            enterAt={voiceAt}
            drawFrames={ruleDone - voiceAt}
            width={420}
            style={{ marginTop: 36 }}
          />
          <Kicker
            text={COPY.s7Mono}
            enterAt={voiceAt + 20}
            style={{ marginTop: LAYOUT.blockGap }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CARD_TOP = 760;
