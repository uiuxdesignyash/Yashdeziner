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
import { BEATS, BRAND, COPY, LAYOUT, SCENES, TYPE, rel } from "../constants";
import { easeOut } from "../components/motion";
import { Kicker } from "../components/text";

// THE CLOSE — sentence 8 (56.35–60.16s).
// Placement 3: Primary_logo2 at 620px wide, centred, at the vertical
// centre of the text safe area. It scales in from 0.94 on a spring while
// a #0B53FF glow blooms to 30% and settles to 12%. Everything is frozen
// from frame 1770 — the final 1.2 seconds hold the logo unmoving, and the
// last frame of the video is the logo.
export const S8Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoAt = rel(BEATS.s8LogoIn, SCENES.s8); // 65
  const stillAt = rel(BEATS.s8AllStill, SCENES.s8); // 94

  const logoW = BRAND.closeWidth;
  const logoH = logoW * BRAND.logoAspect; // ≈205
  const safeCentre = (LAYOUT.textTop + LAYOUT.textBottom) / 2; // 860
  // Clear space: nothing within one pin-glyph height (600px in the source
  // lockup) of the logo at its rendered scale.
  const clearSpace = 600 * (logoW / 1988); // ≈187

  const mark = spring({
    frame: frame - logoAt,
    fps,
    config: { damping: 200 },
    durationInFrames: stillAt - logoAt - 2,
  });

  const glow = interpolate(
    Math.min(frame, stillAt),
    [logoAt, logoAt + 16, stillAt],
    [0, 0.3, 0.12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  return (
    <AbsoluteFill>
      {/* The glow blooming behind the lockup */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(46% 18% at 50% ${(safeCentre / 1920) * 100}%, rgba(11, 83, 255, ${glow}) 0%, transparent 70%)`,
        }}
      />

      <Img
        src={staticFile(BRAND.logo)}
        style={{
          position: "absolute",
          left: (1080 - logoW) / 2,
          top: safeCentre - logoH / 2,
          width: logoW,
          height: logoH,
          opacity: mark,
          scale: String(0.94 + mark * 0.06),
        }}
      />

      <Kicker
        text={COPY.s8Mono}
        enterAt={0}
        size={TYPE.monoSmall}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          top: safeCentre + logoH / 2 + clearSpace,
        }}
      />
    </AbsoluteFill>
  );
};
