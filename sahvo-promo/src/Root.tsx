import "./index.css";
import React from "react";
import {
  CalculateMetadataFunction,
  Composition,
  Folder,
  staticFile,
} from "remotion";
import {
  AUDIO_SRC,
  FALLBACK_DURATION_IN_FRAMES,
  FPS,
  HEIGHT,
  SCENES,
  WIDTH,
} from "./constants";
import { getAudioDuration } from "./get-audio-duration";
import { SahvoPromo } from "./SahvoPromo";
import { Reel01 } from "./reel01/Reel01";
import { R_DURATION, R_FPS, R_HEIGHT, R_WIDTH } from "./reel01/constants";
import { S1Thesis } from "./scenes/S1Thesis";
import { S2Problem } from "./scenes/S2Problem";
import { S3Jaipur } from "./scenes/S3Jaipur";
import { S4Honesty } from "./scenes/S4Honesty";
import { S5Features } from "./scenes/S5Features";
import { S6Promise } from "./scenes/S6Promise";
import { S7Url } from "./scenes/S7Url";
import { S8Wordmark } from "./scenes/S8Wordmark";

// Duration derives from the voiceover file — never hardcoded.
const calculateMetadata: CalculateMetadataFunction<
  Record<string, unknown>
> = async () => {
  const durationInSeconds = await getAudioDuration(staticFile(AUDIO_SRC));
  return {
    durationInFrames: Math.ceil(durationInSeconds * FPS),
  };
};

const sceneEntries = [
  { id: "S1-Thesis", component: S1Thesis, scene: SCENES.s1 },
  { id: "S2-Problem", component: S2Problem, scene: SCENES.s2 },
  { id: "S3-Jaipur", component: S3Jaipur, scene: SCENES.s3 },
  { id: "S4-Honesty", component: S4Honesty, scene: SCENES.s4 },
  { id: "S5-Features", component: S5Features, scene: SCENES.s5 },
  { id: "S6-Promise", component: S6Promise, scene: SCENES.s6 },
  { id: "S7-Url", component: S7Url, scene: SCENES.s7 },
  { id: "S8-Wordmark", component: S8Wordmark, scene: SCENES.s8 },
] as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SahvoPromo"
        component={SahvoPromo}
        durationInFrames={FALLBACK_DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="SahvoReel01"
        component={Reel01}
        durationInFrames={R_DURATION}
        fps={R_FPS}
        width={R_WIDTH}
        height={R_HEIGHT}
      />
      <Folder name="Scenes">
        {sceneEntries.map(({ id, component, scene }) => (
          <Composition
            key={id}
            id={id}
            component={component}
            durationInFrames={scene.duration}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
        ))}
      </Folder>
    </>
  );
};
