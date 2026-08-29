import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, COPY, LAYOUT, TYPE } from "../constants";
import { breathe, easeOut } from "../components/motion";
import { SceneShell } from "../components/SceneShell";
import { BrandMark, CharStaggerHeadline, DrawRule, Kicker } from "../components/text";

// Voice: "Travel in India should not require knowing a local…" (0–5.86s)
// ENTRANCE: character-stagger rise. EXIT: up. Frame 1 doubles as the reel
// cover, so the brand mark, numeral, panel and kicker are seated from frame 0
// and only the headline characters animate in.
export const S1Thesis: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <SceneShell sceneKey="s1" numeralTop={280} numeralRight={40} numeralInstant>
        <BrandMark
          enterAt={-30}
          style={{
            position: "absolute",
            top: LAYOUT.textTop,
            left: LAYOUT.marginX,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: LAYOUT.marginX,
            right: LAYOUT.marginX,
            top: HEADLINE_TOP,
            translate: `0px ${breathe(frame)}px`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -56,
              borderRadius: 40,
              backgroundColor: COLORS.surface,
              border: `1px solid ${COLORS.raised}`,
            }}
          />
          <div style={{ position: "relative" }}>
            <Kicker text={COPY.s1Kicker} enterAt={-30} size={TYPE.monoSmall} />
            <DrawRule
              enterAt={0}
              drawFrames={40}
              width={240}
              style={{ marginTop: 24, marginBottom: LAYOUT.blockGap }}
            />
            <CharStaggerHeadline lines={COPY.s1Headline} enterAt={6} />
          </div>
        </div>

        {/* Raised accent chip — third tonal level in frame */}
        <div
          style={{
            position: "absolute",
            left: LAYOUT.marginX,
            top: CHIP_TOP,
            padding: "24px 36px",
            borderRadius: 26,
            backgroundColor: COLORS.raised,
            opacity: interpolate(frame, [40, 60], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
            translate: `0px ${breathe(frame, 25)}px`,
          }}
        >
          <Kicker text="FOR TRAVELLERS IN INDIA" enterAt={44} size={TYPE.monoSmall} />
        </div>
      </SceneShell>
    </AbsoluteFill>
  );
};

const HEADLINE_TOP = 780;
const CHIP_TOP = 1240;
