import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  BEATS,
  COLORS,
  GLOW,
  LAYOUT,
  MOTION,
  SCENES,
  SCENE_META,
  SCENE_ORDER,
  SceneKey,
} from "../constants";

const sceneAt = (frame: number): SceneKey => {
  let current: SceneKey = "s1";
  for (const key of SCENE_ORDER) {
    if (frame >= SCENES[key].start) current = key;
  }
  return current;
};

/**
 * Global background: three tonal levels start here (canvas base + a soft
 * elevated wash), a slow-drifting dot field at ~7% opacity, and one large
 * #0B53FF radial glow at 20%, positioned differently per scene and drifting.
 * Sits under every scene; scenes themselves are transparent.
 */
export const Background: React.FC = () => {
  // Everything freezes at the close — nothing resolves after the audio ends.
  const frame = Math.min(useCurrentFrame(), BEATS.s8AllStill);
  const key = sceneAt(frame);
  const { glow } = SCENE_META[key];
  const scene = SCENES[key];
  const p = (frame - scene.start) / scene.duration;

  const gx = interpolate(p, [0, 1], [glow.x, glow.driftTo.x]);
  const gy = interpolate(p, [0, 1], [glow.y, glow.driftTo.y]);

  // The glow eases off in the final still moments so nothing resolves late.
  const glowOpacity =
    key === "s8"
      ? interpolate(frame, [SCENES.s8.start + 100, SCENES.s8.start + 114], [GLOW.opacity, GLOW.opacity * 0.8], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : GLOW.opacity;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      {/* Elevated wash — second tonal level, always present */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 50% 20%, ${COLORS.surface} 0%, transparent 65%)`,
          opacity: 0.8,
        }}
      />
      {/* Drifting dot field */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle, ${COLORS.soft} 1.5px, transparent 1.5px)`,
          backgroundSize: "72px 72px",
          backgroundPosition: `${frame * 0.12}px ${frame * 0.08}px`,
          opacity: 0.07,
        }}
      />
      {/* The per-scene brand glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(${GLOW.widthPct}% ${GLOW.heightPct}% at ${gx}% ${gy}%, rgba(11, 83, 255, ${glowOpacity}) 0%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Persistent 8-segment chapter rail on the left edge — the progress rail
 * extended across the whole video. Past chapters are filled; the current
 * one fills with scene progress.
 */
export const ChapterRail: React.FC = () => {
  const frame = useCurrentFrame();
  const totalH = LAYOUT.railBottom - LAYOUT.railTop;
  const gap = 10;
  const segH = (totalH - gap * (SCENE_ORDER.length - 1)) / SCENE_ORDER.length;

  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.railX,
        top: LAYOUT.railTop,
        display: "flex",
        flexDirection: "column",
        gap,
      }}
    >
      {SCENE_ORDER.map((key) => {
        const scene = SCENES[key];
        // The final segment completes at the freeze frame, not the last frame.
        const fillEnd =
          key === "s8" ? BEATS.s8AllStill : scene.start + scene.duration;
        const fill = interpolate(frame, [scene.start, fillEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={key}
            style={{
              width: 6,
              height: segH,
              borderRadius: 3,
              backgroundColor: COLORS.raised,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${fill * 100}%`,
                backgroundColor: COLORS.brand,
                opacity: 0.9,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/**
 * A #0B53FF rule sweeping across the frame at each section cut.
 * The transition into S7 is excluded — that cut is the one cinematic zoom.
 */
const SWEEP_BOUNDARIES = [
  SCENES.s2.start,
  SCENES.s3.start,
  SCENES.s4.start,
  SCENES.s5.start,
  SCENES.s6.start,
  SCENES.s8.start,
];

export const TransitionSweeps: React.FC = () => {
  const frame = useCurrentFrame();
  const half = MOTION.sweepFrames / 2;
  return (
    <>
      {SWEEP_BOUNDARIES.map((b) => {
        if (frame < b - half || frame > b + half) return null;
        return (
          <div
            key={b}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 5,
              left: interpolate(frame, [b - half, b + half], [-60, 1140]),
              backgroundColor: COLORS.brand,
              boxShadow: "0 0 40px 8px rgba(11, 83, 255, 0.55)",
              opacity: interpolate(
                frame,
                [b - half, b - half + 3, b + half - 3, b + half],
                [0, 1, 1, 0],
              ),
            }}
          />
        );
      })}
    </>
  );
};
