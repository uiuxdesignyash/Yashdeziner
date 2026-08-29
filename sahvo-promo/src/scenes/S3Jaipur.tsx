import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, PHOTOS, SCENES, rel } from "../constants";
import { pulse } from "../components/motion";
import { PhotoLayer } from "../components/PhotoLayer";
import { Editorial, HeadlineLines, Kicker } from "../components/text";

// PHOTO-LED — sentence 3 (13.97–19.96s).
// The monument carries the frame. The pin drops with a spring and ONE
// expanding ripple exactly on the "Jaipur" syllable. No map, no route.
export const S3Jaipur: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headlineAt = rel(BEATS.s3HeadlineLands, SCENES.s3); // 21
  const pinAt = rel(BEATS.s3JaipurPin, SCENES.s3); // 166

  const pinSpring = spring({
    frame: frame - pinAt,
    fps,
    config: { damping: 13, mass: 0.8 },
    durationInFrames: 28,
  });
  const rippleP = interpolate(frame, [pinAt + 4, pinAt + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <PhotoLayer
        src={PHOTOS.monumentDawn.src}
        overFrames={SCENES.s3.duration}
        dodgeCorner="tr"
        extraDim={0.06}
      />

      {/* Scrim so type never fights the photograph */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: HEAD_TOP - 180,
          bottom: 0,
          background: `linear-gradient(transparent, ${COLORS.canvas}D9 45%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          right: LAYOUT.marginX,
          top: HEAD_TOP,
        }}
      >
        <Kicker text="THE FIRST CITY" enterAt={headlineAt - 8} />
        <HeadlineLines
          lines={[COPY.s3Headline]}
          enterAt={headlineAt}
          style={{ marginTop: 22, textShadow: "0 6px 50px rgba(11, 19, 32, 0.9)" }}
        />
        <Editorial
          text={COPY.s3Editorial}
          enterAt={headlineAt + 28}
          style={{ textShadow: "0 4px 40px rgba(11, 19, 32, 0.9)" }}
        />

        {/* Pin chip — lands on the syllable */}
        <div
          style={{
            marginTop: LAYOUT.blockGap,
            display: "inline-flex",
            alignItems: "center",
            gap: 28,
            padding: "28px 38px",
            borderRadius: 28,
            backgroundColor: COLORS.raised,
            border: `1px solid ${COLORS.surface}`,
            opacity: Math.min(pinSpring * 1.4, 1),
            scale: String(0.7 + pinSpring * 0.3),
            translate: `0px ${(1 - pinSpring) * -60}px`,
            transformOrigin: "left center",
          }}
        >
          <div style={{ position: "relative", width: 38, height: 38 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                backgroundColor: COLORS.brand,
                boxShadow: `0 0 ${18 + pulse(frame, 10) * 12}px rgba(11, 83, 255, 0.65)`,
              }}
            />
            {rippleP > 0 && rippleP < 1 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `3px solid ${COLORS.brand}`,
                  scale: String(1 + rippleP * 2.4),
                  opacity: 0.7 * (1 - rippleP),
                }}
              />
            )}
          </div>
          <Kicker text={COPY.s3PilotLabel} enterAt={pinAt} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const HEAD_TOP = 1000;
