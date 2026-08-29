import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, PHOTOS, SCENES, rel } from "../constants";
import { breathe, easeOut } from "../components/motion";
import { FareGapBars, Odometer } from "../components/graphics";
import { PhotoLayer } from "../components/PhotoLayer";
import { Editorial, HeadlineLines, Kicker } from "../components/text";

// GRAPHIC-LED — sentence 2 (6.97–12.95s).
// The rickshaw photograph sits far back; the odometer rolls (digits stay
// blurred — the climb is the message, no figure is legible) and the
// QUOTED/METER bars pull apart. "The fare gap." lands on "inflated fares".
export const S2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const textAt = rel(BEATS.s2TextLands, SCENES.s2); // 62

  return (
    <AbsoluteFill>
      <PhotoLayer
        src={PHOTOS.rickshaw.src}
        overFrames={SCENES.s2.duration}
        dodgeCorner="bl"
        extraDim={0.14}
      />

      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          right: LAYOUT.marginX,
          top: HEAD_TOP,
        }}
      >
        <Kicker text={COPY.s2Kicker} enterAt={10} />
        <HeadlineLines
          lines={[COPY.s2Headline]}
          enterAt={textAt}
          style={{ marginTop: 22 }}
        />
        <Editorial text={COPY.s2Editorial} enterAt={textAt + 26} />
      </div>

      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          right: LAYOUT.marginX,
          top: PANEL_TOP,
          padding: "56px 60px",
          borderRadius: 40,
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.raised}`,
          translate: `0px ${breathe(frame, 30)}px`,
          opacity: interpolate(frame, [6, 24], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          }),
        }}
      >
        {/* The meter that keeps climbing */}
        <Odometer startAt={8} style={{ justifyContent: "center" }} />
        <FareGapBars
          startAt={textAt + 6}
          maxWidth={560}
          style={{ marginTop: 48 }}
        />
      </div>
    </AbsoluteFill>
  );
};

const HEAD_TOP = 300;
const PANEL_TOP = 600;
