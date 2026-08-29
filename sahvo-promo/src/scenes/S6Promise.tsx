import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, COPY, MOTION, SCENES, TYPE, rel } from "../constants";
import { easeOut } from "../components/motion";
import { SceneShell } from "../components/SceneShell";
import { CharStaggerHeadline } from "../components/text";

// Voice: "…busy markets or historic monuments, you deserve clear answers and
// practical safety support." (39.32–47.29s)
// ENTRANCE: character stagger on the two words. EXIT: the single cinematic
// zoom of the video — this scene scales away into the URL frame.
// The hold: fewest elements in the video, no icons of any kind (rule 2).
export const S6Promise: React.FC = () => {
  const frame = useCurrentFrame();
  const textAt = rel(BEATS.s6TextLands, SCENES.s6);

  const zoomStart = SCENES.s6.duration - MOTION.zoomFrames;
  const zoomP = interpolate(frame, [zoomStart, SCENES.s6.duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  // Concentric rings — quiet structure behind the two words, drifting open.
  const ringBase = interpolate(frame, [0, SCENES.s6.duration], [1, 1.12]);

  return (
    <AbsoluteFill>
      <SceneShell sceneKey="s6" numeralTop={300} numeralRight={44}>
        <AbsoluteFill
          style={{
            scale: String(1 + zoomP * 0.16),
            opacity: 1 - zoomP,
          }}
        >
          {[420, 640, 880].map((d, i) => (
            <div
              key={d}
              style={{
                position: "absolute",
                left: "50%",
                top: "46%",
                width: d,
                height: d,
                marginLeft: -d / 2,
                marginTop: -d / 2,
                borderRadius: "50%",
                border: `1px solid ${COLORS.raised}`,
                scale: String(ringBase + i * 0.02),
                opacity: interpolate(frame, [10 + i * 8, 40 + i * 8], [0, 0.7], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: easeOut,
                }),
              }}
            />
          ))}

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: HEADLINE_TOP,
            }}
          >
            <CharStaggerHeadline
              lines={[COPY.s6Headline]}
              enterAt={textAt}
              size={TYPE.display}
              align="center"
            />
          </div>
        </AbsoluteFill>
      </SceneShell>
    </AbsoluteFill>
  );
};

const HEADLINE_TOP = 830;
