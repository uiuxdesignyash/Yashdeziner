import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, SCENES, rel } from "../constants";
import { breathe } from "../components/motion";
import { PortraitWindow } from "../components/PortraitWindow";
import { HeadlineLines, Kicker } from "../components/text";

// Voice: "We are building Sahvo… starting with a planned Jaipur pilot." (13.97–19.96s)
// The one sync event: the pilot marker lands exactly on the "Jaipur" syllable.
export const S3Jaipur: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headlineAt = rel(BEATS.s3HeadlineLands, SCENES.s3);
  const pinAt = rel(BEATS.s3JaipurPin, SCENES.s3);

  const pinSpring = spring({
    frame: frame - pinAt,
    fps,
    config: { damping: 14, mass: 0.8 },
    durationInFrames: 30,
  });

  // Ring pulses keep radiating after the pin lands — the scene's living motion.
  const ringCycle = ((frame - pinAt) % 60) / 60;
  const ringVisible = frame >= pinAt;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      <PortraitWindow
        screenshot="pilot"
        enterAt={0}
        driftOverFrames={SCENES.s3.duration}
        driftTo={{ x: 30, y: 20 }}
        zoom={1.3}
        height={900}
        style={{
          position: "absolute",
          left: LAYOUT.windowX,
          top: LAYOUT.marginY,
        }}
      />

      <HeadlineLines
        lines={COPY.s3Headline}
        enterAt={headlineAt}
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          top: HEADLINE_TOP,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          top: PIN_TOP,
          display: "flex",
          alignItems: "center",
          gap: 28,
          padding: "36px 44px",
          borderRadius: 32,
          backgroundColor: COLORS.raised,
          opacity: Math.min(pinSpring * 1.4, 1),
          scale: String(0.6 + pinSpring * 0.4),
          translate: `0px ${breathe(frame, 45)}px`,
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
              boxShadow: "0 0 24px rgba(11, 83, 255, 0.6)",
            }}
          />
          {ringVisible && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `3px solid ${COLORS.brand}`,
                scale: String(1 + ringCycle * 1.8),
                opacity: interpolate(ringCycle, [0, 1], [0.7, 0]),
              }}
            />
          )}
        </div>
        <Kicker text={COPY.s3PilotLabel} enterAt={pinAt} />
      </div>
    </AbsoluteFill>
  );
};

const HEADLINE_TOP = 1150;
const PIN_TOP = 1480;
