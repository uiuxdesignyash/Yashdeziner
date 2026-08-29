import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, SCENES, TYPE, rel } from "../constants";
import { breathe, easeOut } from "../components/motion";
import { FONTS } from "../fonts";
import { PortraitWindow } from "../components/PortraitWindow";
import { DrawRule, Kicker } from "../components/text";

// Voice: "Visit sahvoapp.com and follow the journey…" (48.29–55.40s)
// The URL — exact string, largest type in the video — is fully seated the
// moment the voice says it. 01-hero ghosts behind at 20%.
export const S7Url: React.FC = () => {
  const frame = useCurrentFrame();
  const voiceAt = rel(BEATS.s7VoiceStart, SCENES.s7); // 15
  const ruleDone = rel(BEATS.s7RuleDone, SCENES.s7);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      <PortraitWindow
        screenshot="hero"
        enterAt={null}
        driftOverFrames={SCENES.s7.duration}
        driftTo={{ x: 24, y: -26 }}
        zoom={1.3}
        opacity={0.2}
        height={1240}
        style={{
          position: "absolute",
          left: LAYOUT.windowX,
          top: 340,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          right: LAYOUT.marginX,
          top: CARD_TOP,
          padding: "80px 64px",
          borderRadius: 44,
          backgroundColor: COLORS.raised,
          boxShadow: "0 40px 90px rgba(0, 0, 0, 0.5)",
          translate: `0px ${breathe(frame, 20)}px`,
          opacity: interpolate(frame, [0, voiceAt], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          }),
          scale: interpolate(frame, [0, voiceAt], [0.96, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
            output: "perceptual-scale",
          }),
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
  );
};

const CARD_TOP = 820;
