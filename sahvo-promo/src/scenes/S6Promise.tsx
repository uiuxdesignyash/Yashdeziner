import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, COPY, SCENES, TYPE, rel } from "../constants";
import { HeadlineLines } from "../components/text";

// Voice: "…busy markets or historic monuments, you deserve clear answers and
// practical safety support." (39.32–47.29s)
// The hold. Fewest elements in the video. No icons of any kind (rule 2) —
// the restraint is the promise. Two words land exactly on "clear answers".
export const S6Promise: React.FC = () => {
  const frame = useCurrentFrame();
  const textAt = rel(BEATS.s6TextLands, SCENES.s6);

  // A soft brand glow drifting slowly is the scene's only other element.
  const glowX = interpolate(frame, [0, SCENES.s6.duration], [30, 70]);
  const glowY = interpolate(frame, [0, SCENES.s6.duration], [62, 46]);

  return (
    <AbsoluteFill
      style={{
        // Canvas deepening into surface — two background tones, no panel.
        background: `radial-gradient(120% 90% at 50% 30%, ${COLORS.surface} 0%, ${COLORS.canvas} 70%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 22% at ${glowX}% ${glowY}%, rgba(11, 83, 255, 0.22) 0%, transparent 100%)`,
        }}
      />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <HeadlineLines
          lines={[COPY.s6Headline]}
          enterAt={textAt}
          size={TYPE.display}
          align="center"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
