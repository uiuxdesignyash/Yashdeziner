import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BEATS, BRAND, COLORS, COPY, LAYOUT, PHOTOS, SCENES, rel } from "../constants";
import { PhotoLayer } from "../components/PhotoLayer";
import { Editorial, HeadlineLines, Kicker } from "../components/text";

// PHOTO-LED — sentence 3 (13.97–19.96s).
// The strongest logo moment: the REAL pin glyph (cropped from
// Primary_logo2, never redrawn) falls with a spring, lands exactly on the
// "Jaipur" syllable, and emits ONE expanding ripple ring. The mark IS a
// location pin — identity and message on the same beat. It gets space and
// holds. No map, no route, nothing implying live tracking.
export const S3Jaipur: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headlineAt = rel(BEATS.s3HeadlineLands, SCENES.s3); // 21
  const pinAt = rel(BEATS.s3JaipurPin, SCENES.s3); // 166

  const pinH = BRAND.pinDropHeight;
  const pinW = pinH * BRAND.pinAspect;

  // The fall: a spring from above, landing on the syllable.
  const drop = spring({
    frame: frame - (pinAt - 14),
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 120 },
    durationInFrames: 26,
  });

  const rippleP = interpolate(frame, [pinAt + 2, pinAt + 36], [0, 1], {
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

      {/* The pin — one object, no rotation, held in clear space */}
      <div
        style={{
          position: "absolute",
          left: PIN_CENTER_X - pinW / 2,
          top: PIN_BASE_Y - pinH,
          width: pinW,
          height: pinH,
          opacity: Math.min(drop * 1.6, 1),
          translate: `0px ${(drop - 1) * 360}px`,
        }}
      >
        <Img
          src={staticFile(BRAND.pin)}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ONE ripple ring from the pin's base, fading as it expands */}
      {rippleP > 0 && rippleP < 1 && (
        <div
          style={{
            position: "absolute",
            left: PIN_CENTER_X - 30,
            top: PIN_BASE_Y - 14,
            width: 60,
            height: 28,
            borderRadius: "50%",
            border: `3px solid ${COLORS.brand}`,
            scale: String(1 + rippleP * 4.2),
            opacity: 0.75 * (1 - rippleP),
          }}
        />
      )}

      {/* Label beneath the pin, after it lands */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: PIN_BASE_Y + 56,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [pinAt + 10, pinAt + 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Kicker text={COPY.s3PilotLabel} enterAt={pinAt + 10} />
      </div>

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
      </div>
    </AbsoluteFill>
  );
};

const PIN_CENTER_X = 540;
const PIN_BASE_Y = 700;
const HEAD_TOP = 1080;
