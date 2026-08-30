import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  R_COLORS,
  R_MUSIC_SRC,
  R_SCENES,
  R_SFX_SRC,
  R_VO_SRC,
  VO_PRESENT,
} from "./constants";
import { R1India, R2Questions, R3Three, R4Idea } from "./scenes1to4";
import { R5Reveal, R6Expand, R7End } from "./scenes5to7";
import { ReelRail } from "./ui";

const scenes = [
  { key: "r1", C: R1India },
  { key: "r2", C: R2Questions },
  { key: "r3", C: R3Three },
  { key: "r4", C: R4Idea },
  { key: "r5", C: R5Reveal },
  { key: "r6", C: R6Expand },
  { key: "r7", C: R7End },
] as const;

export const Reel01: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: R_COLORS.canvas }}>
      {VO_PRESENT && <Audio src={staticFile(R_VO_SRC)} />}
      <Audio src={staticFile(R_MUSIC_SRC)} />
      <Audio src={staticFile(R_SFX_SRC)} />
      {scenes.map(({ key, C }) => {
        const { start, duration } = R_SCENES[key];
        return (
          <Sequence
            key={key}
            name={key.toUpperCase()}
            from={start}
            durationInFrames={duration}
            premountFor={45}
          >
            <C />
          </Sequence>
        );
      })}
      <ReelRail />
    </AbsoluteFill>
  );
};
