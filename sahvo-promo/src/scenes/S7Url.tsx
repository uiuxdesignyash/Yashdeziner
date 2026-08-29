import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, MOTION, SCENES, TYPE, rel } from "../constants";
import { breathe, easeOut } from "../components/motion";
import { FONTS } from "../fonts";
import { PortraitWindow } from "../components/PortraitWindow";
import { SceneShell } from "../components/SceneShell";
import { DrawRule, Kicker } from "../components/text";

// Voice: "Visit sahvoapp.com and follow the journey…" (48.29–55.40s)
// ENTRANCE: the one cinematic zoom — the whole frame settles from 1.22× as
// S6 zooms away. EXIT: down. The URL card sits at the vertical centre of the
// frame, fully seated the moment the voice says it.
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
      <SceneShell sceneKey="s7" numeralTop={260} numeralRight={36}>
        <AbsoluteFill
          style={{
            scale: String(1.22 - zoomP * 0.22),
            opacity: zoomP,
          }}
        >
          <PortraitWindow
            screenshot="hero"
            enterAt={null}
            driftOverFrames={SCENES.s7.duration}
            driftTo={{ x: 24, y: -26 }}
            zoom={1.3}
            opacity={0.18}
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
      </SceneShell>
    </AbsoluteFill>
  );
};

const CARD_TOP = 760;
