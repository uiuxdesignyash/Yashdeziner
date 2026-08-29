import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, SCENES, rel } from "../constants";
import { breathe } from "../components/motion";
import { PortraitWindow } from "../components/PortraitWindow";
import { HeadlineLines, Kicker } from "../components/text";

// Voice: "Too many visitors face inflated fares and uncertainty…" (6.97–12.95s)
// The 02-problem capture carries the scene; the text lands ON "inflated fares".
// Rule 3: no invented statistic anywhere.
export const S2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const textAt = rel(BEATS.s2TextLands, SCENES.s2);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      <PortraitWindow
        screenshot="problem"
        enterAt={0}
        driftOverFrames={SCENES.s2.duration}
        driftTo={{ x: -30, y: -20 }}
        zoom={1.3}
        height={980}
        style={{
          position: "absolute",
          left: LAYOUT.windowX,
          top: LAYOUT.marginY,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: LAYOUT.marginX,
          right: LAYOUT.marginX,
          top: TEXT_TOP,
          translate: `0px ${breathe(frame, 30)}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -48,
            borderRadius: 36,
            backgroundColor: COLORS.surface,
          }}
        />
        <div style={{ position: "relative" }}>
          <Kicker
            text={COPY.s2Kicker}
            enterAt={textAt - 8}
            style={{ marginBottom: LAYOUT.blockGap }}
          />
          <HeadlineLines lines={COPY.s2Headline} enterAt={textAt} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TEXT_TOP = 1300;
