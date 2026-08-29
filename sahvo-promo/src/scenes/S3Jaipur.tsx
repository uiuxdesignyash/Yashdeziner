import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, SCENES, rel } from "../constants";
import { breathe, pulse } from "../components/motion";
import { PortraitWindow } from "../components/PortraitWindow";
import { SceneShell } from "../components/SceneShell";
import { HeadlineLines, Kicker } from "../components/text";

// Voice: "We are building Sahvo… starting with a planned Jaipur pilot." (13.97–19.96s)
// ENTRANCE: scale-and-settle with an overshoot spring on the headline panel;
// the window clips in from the right. EXIT: down. The pin drops on the
// "Jaipur" syllable with a single ripple ring — no map, no route, nothing
// implying live tracking.
export const S3Jaipur: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headlineAt = rel(BEATS.s3HeadlineLands, SCENES.s3);
  const pinAt = rel(BEATS.s3JaipurPin, SCENES.s3);

  const panelSpring = spring({
    frame: frame - headlineAt + 8,
    fps,
    config: { damping: 11, mass: 0.7 },
    durationInFrames: 34,
  });

  const pinSpring = spring({
    frame: frame - pinAt,
    fps,
    config: { damping: 13, mass: 0.8 },
    durationInFrames: 28,
  });

  // ONE ripple ring, then a settled glow.
  const rippleP = interpolate(frame, [pinAt + 4, pinAt + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <SceneShell sceneKey="s3" numeralTop={950} numeralRight={36}>
        <PortraitWindow
          screenshot="pilot"
          enterAt={0}
          reveal="clip-right"
          driftOverFrames={SCENES.s3.duration}
          driftTo={{ x: 30, y: 20 }}
          zoom={1.3}
          height={800}
          objectPosition="50% 15%"
          style={{
            position: "absolute",
            left: LAYOUT.windowX,
            top: WINDOW_TOP,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: LAYOUT.marginX,
            right: LAYOUT.marginX,
            top: PANEL_TOP,
            padding: "48px 56px",
            borderRadius: 36,
            backgroundColor: COLORS.surface,
            border: `1px solid ${COLORS.raised}`,
            opacity: Math.min(panelSpring * 1.6, 1),
            scale: String(0.85 + panelSpring * 0.15),
            translate: `0px ${breathe(frame, 15)}px`,
          }}
        >
          <HeadlineLines lines={COPY.s3Headline} enterAt={headlineAt} />

          <div
            style={{
              marginTop: LAYOUT.blockGap,
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "28px 36px",
              borderRadius: 26,
              backgroundColor: COLORS.raised,
              opacity: Math.min(pinSpring * 1.4, 1),
              scale: String(0.7 + pinSpring * 0.3),
              transformOrigin: "left center",
            }}
          >
            <div style={{ position: "relative", width: 36, height: 36 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  backgroundColor: COLORS.brand,
                  boxShadow: `0 0 ${18 + pulse(frame, 10) * 12}px rgba(11, 83, 255, 0.6)`,
                }}
              />
              {rippleP > 0 && rippleP < 1 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `3px solid ${COLORS.brand}`,
                    scale: String(1 + rippleP * 2.2),
                    opacity: 0.7 * (1 - rippleP),
                  }}
                />
              )}
            </div>
            <Kicker text={COPY.s3PilotLabel} enterAt={pinAt} />
          </div>
        </div>
      </SceneShell>
    </AbsoluteFill>
  );
};

const WINDOW_TOP = 170;
const PANEL_TOP = 1030;
