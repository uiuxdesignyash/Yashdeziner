import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, COPY, HOOK, LAYOUT, PHOTOS, SCENES, TYPE } from "../constants";
import { easeOut, pulse } from "../components/motion";
import { FONTS } from "../fonts";
import { PhotoLayer } from "../components/PhotoLayer";
import { BrandMark, Kicker } from "../components/text";

// THE HOOK — sentence 1 (0–5.86s).
// Frame 1 is fully composed (it is the reel cover): treated Jaipur imagery
// already in Ken Burns motion, brand mark, kicker and pilot chip seated.
// A rule sweeps the frame in frames 2–12; "Feel secure." lands by frame 20,
// inside the first 0.8 seconds.
export const S1Thesis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Overshoot spring — the headline plants itself, hard and early.
  const land = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 130 },
    durationInFrames: HOOK.headlineLands,
  });

  const sweepX = interpolate(
    frame,
    [HOOK.sweepStart, HOOK.sweepEnd],
    [-80, 1160],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  return (
    <AbsoluteFill>
      <PhotoLayer
        src={PHOTOS.hawaMahal.src}
        overFrames={SCENES.s1.duration}
        dodgeCorner="tr"
      />

      {/* Transient sweep — in motion from frame 2 */}
      {frame <= HOOK.sweepEnd + 2 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 5,
            left: sweepX,
            backgroundColor: COLORS.brand,
            boxShadow: "0 0 40px 8px rgba(11, 83, 255, 0.55)",
          }}
        />
      )}

      <BrandMark
        enterAt={-30}
        style={{
          position: "absolute",
          top: LAYOUT.textTop,
          left: LAYOUT.marginX,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          right: LAYOUT.marginX,
          top: KICKER_TOP,
        }}
      >
        <Kicker text={COPY.s1Kicker} enterAt={-30} size={TYPE.monoSmall} />
        <div
          style={{
            ...FONTS.display,
            fontSize: HEADLINE_SIZE,
            lineHeight: 1.04,
            color: COLORS.ink,
            marginTop: 28,
            opacity: Math.min(land * 1.5, 1),
            scale: String(0.9 + land * 0.1),
            translate: `0px ${(1 - land) * 50}px`,
            transformOrigin: "left center",
            textShadow: "0 8px 60px rgba(11, 19, 32, 0.8)",
          }}
        >
          {HOOK.headline}
        </div>
        <div
          style={{
            width: interpolate(frame, [10, 42], [0, 260], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
            height: LAYOUT.ruleThickness,
            backgroundColor: COLORS.brand,
            marginTop: 36,
            boxShadow: `0 0 ${14 + pulse(frame) * 12}px rgba(11, 83, 255, 0.5)`,
          }}
        />
      </div>

      {/* Pilot chip anchors the lower third, present from frame 0 */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          top: CHIP_TOP,
          padding: "22px 34px",
          borderRadius: 24,
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.raised}`,
          translate: `0px ${Math.sin((frame / 90) * Math.PI * 2) * 5}px`,
        }}
      >
        <Kicker text="PILOT · JAIPUR · 2026" enterAt={-30} size={TYPE.monoSmall} />
      </div>
    </AbsoluteFill>
  );
};

const KICKER_TOP = 760;
const HEADLINE_SIZE = 128;
const CHIP_TOP = 1340;
