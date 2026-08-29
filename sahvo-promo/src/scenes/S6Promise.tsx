import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COPY, PHOTOS, SCENES, TYPE, rel } from "../constants";
import { PhotoLayer } from "../components/PhotoLayer";
import { CharStaggerHeadline, Editorial } from "../components/text";

// PHOTO-LED — sentence 6 (39.32–47.29s). The hold.
// The market plays under "busy markets or historic monuments", crossfading
// to the walker — unhurried, in control — just before "you deserve".
// "Clear answers." lands exactly on the words. Fewest elements in the video.
export const S6Promise: React.FC = () => {
  const frame = useCurrentFrame();
  const crossAt = rel(BEATS.s6Crossfade, SCENES.s6); // 130
  const textAt = rel(BEATS.s6TextLands, SCENES.s6); // 145

  const cross = interpolate(frame, [crossAt, crossAt + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <PhotoLayer
        src={PHOTOS.market.src}
        overFrames={SCENES.s6.duration}
        dodgeCorner="tl"
        extraDim={0.1}
        opacity={1 - cross}
      />
      <PhotoLayer
        src={PHOTOS.walking.src}
        overFrames={SCENES.s6.duration}
        dodgeCorner="br"
        extraDim={0.12}
        opacity={cross}
      />

      <div style={{ position: "absolute", left: 0, right: 0, top: HEADLINE_TOP }}>
        <CharStaggerHeadline
          lines={[COPY.s6Headline]}
          enterAt={textAt}
          size={TYPE.display}
          align="center"
          style={{ textShadow: "0 8px 60px rgba(11, 19, 32, 0.9)" }}
        />
        {/* Enters only after the stagger has fully completed (~frame 177) */}
        <Editorial
          text={COPY.s6Editorial}
          enterAt={textAt + 40}
          align="center"
          style={{ textShadow: "0 4px 40px rgba(11, 19, 32, 0.9)" }}
        />
      </div>
    </AbsoluteFill>
  );
};

const HEADLINE_TOP = 860;
