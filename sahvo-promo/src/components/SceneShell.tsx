import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  COLORS,
  GHOST_NUMERAL_OPACITY,
  MOTION,
  SCENES,
  SCENE_META,
  SceneKey,
  TYPE,
} from "../constants";
import { FONTS } from "../fonts";
import { breathe, easeOut } from "./motion";

/**
 * Per-scene wrapper: the counting ghost numeral behind everything, plus the
 * EXIT — content leaves in the direction opposite to its entrance during the
 * scene's last frames. S8 declares {0,0} and stays put.
 */
export const SceneShell: React.FC<{
  sceneKey: SceneKey;
  numeralTop?: number;
  numeralRight?: number;
  /** Show the numeral from frame 0 with no fade (used for the S1 cover frame). */
  numeralInstant?: boolean;
  /** Scene-relative frame after which all shell motion freezes (S8 close). */
  freezeAt?: number;
  children: React.ReactNode;
}> = ({
  sceneKey,
  numeralTop = 260,
  numeralRight = 40,
  numeralInstant,
  freezeAt,
  children,
}) => {
  const rawFrame = useCurrentFrame();
  const frame = freezeAt === undefined ? rawFrame : Math.min(rawFrame, freezeAt);
  const scene = SCENES[sceneKey];
  const { numeral, exitDir } = SCENE_META[sceneKey];

  const exitStart = scene.duration - MOTION.exitFrames;
  const hasExit = exitDir.x !== 0 || exitDir.y !== 0;
  const exitP = hasExit
    ? interpolate(frame, [exitStart, scene.duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeOut,
      })
    : 0;

  return (
    <>
      {/* Ghost numeral — parallaxes at half the panels' breathing speed */}
      <div
        style={{
          position: "absolute",
          top: numeralTop,
          right: numeralRight,
          ...FONTS.display,
          fontSize: TYPE.ghostNumeral,
          lineHeight: 1,
          color: COLORS.ink,
          opacity: numeralInstant
            ? GHOST_NUMERAL_OPACITY
            : interpolate(frame, [0, 24], [0, GHOST_NUMERAL_OPACITY], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeOut,
              }),
          translate: `0px ${breathe(frame, 40) * 0.5}px`,
        }}
      >
        {numeral}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${exitDir.x * exitP}px ${exitDir.y * exitP}px`,
          opacity: 1 - exitP,
        }}
      >
        {children}
      </div>
    </>
  );
};
