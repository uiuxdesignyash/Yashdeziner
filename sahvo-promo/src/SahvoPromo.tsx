import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { AUDIO_SRC, COLORS, SCENES, SFX_SRC } from "./constants";
import { Background, ChapterRail, TransitionSweeps } from "./components/global";
import { S1Thesis } from "./scenes/S1Thesis";
import { S2Problem } from "./scenes/S2Problem";
import { S3Jaipur } from "./scenes/S3Jaipur";
import { S4Honesty } from "./scenes/S4Honesty";
import { S5Features } from "./scenes/S5Features";
import { S6Promise } from "./scenes/S6Promise";
import { S7Url } from "./scenes/S7Url";
import { S8Wordmark } from "./scenes/S8Wordmark";

const sceneComponents = {
  s1: S1Thesis,
  s2: S2Problem,
  s3: S3Jaipur,
  s4: S4Honesty,
  s5: S5Features,
  s6: S6Promise,
  s7: S7Url,
  s8: S8Wordmark,
} as const;

export const SahvoPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      <Audio src={staticFile(AUDIO_SRC)} />
      <Audio src={staticFile(SFX_SRC)} />
      <Background />
      {(Object.keys(sceneComponents) as (keyof typeof sceneComponents)[]).map(
        (key) => {
          const Scene = sceneComponents[key];
          const { start, duration } = SCENES[key];
          return (
            <Sequence
              key={key}
              name={key.toUpperCase()}
              from={start}
              durationInFrames={duration}
              premountFor={45}
            >
              <Scene />
            </Sequence>
          );
        },
      )}
      <ChapterRail />
      <TransitionSweeps />
    </AbsoluteFill>
  );
};
