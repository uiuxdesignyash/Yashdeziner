import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, COPY, LAYOUT, SCENES, TYPE, rel } from "../constants";
import { breathe, easeOut } from "../components/motion";
import { FONTS } from "../fonts";
import { PortraitWindow } from "../components/PortraitWindow";
import { SceneShell } from "../components/SceneShell";
import { HeadlineLines, Kicker } from "../components/text";

// Voice: "Too many visitors face inflated fares and uncertainty…" (6.97–12.95s)
// ENTRANCE: mask wipe — the window clips in from the left, the text panel
// wipes from the left edge. EXIT: left. The fare-gap graphic shows two
// abstract bars pulling apart — deliberately unquantified (rule 3).
export const S2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const textAt = rel(BEATS.s2TextLands, SCENES.s2);

  const panelWipe = interpolate(frame, [textAt - 16, textAt + 6], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  // The QUOTED bar stretches away from the METER bar — the gap, not a number.
  const quotedW = interpolate(frame, [textAt + 14, textAt + 54], [280, 560], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill>
      <SceneShell sceneKey="s2" numeralTop={1080} numeralRight={30}>
        <PortraitWindow
          screenshot="problem"
          enterAt={0}
          reveal="clip-left"
          driftOverFrames={SCENES.s2.duration}
          driftTo={{ x: -30, y: -20 }}
          zoom={1.3}
          height={840}
          objectPosition="50% 20%"
          style={{
            position: "absolute",
            left: LAYOUT.windowX,
            top: WINDOW_TOP,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: LAYOUT.marginX,
            right: LAYOUT.marginX,
            top: PANEL_TOP,
            padding: "48px 56px",
            borderRadius: 36,
            backgroundColor: COLORS.surface,
            border: `1px solid ${COLORS.raised}`,
            clipPath: `inset(0 ${panelWipe}% 0 0 round 36px)`,
            translate: `0px ${breathe(frame, 30)}px`,
          }}
        >
          <Kicker text={COPY.s2Kicker} enterAt={textAt - 8} />
          <div
            style={{
              width: 200,
              height: LAYOUT.ruleThickness,
              backgroundColor: COLORS.brand,
              margin: "24px 0",
            }}
          />
          <HeadlineLines lines={COPY.s2Headline} enterAt={textAt} />

          {/* Fare-gap graphic — two bars pulling apart, no figures */}
          <div style={{ marginTop: LAYOUT.blockGap }}>
            {[
              { label: COPY.s2BarQuoted, width: quotedW, color: COLORS.brand },
              { label: COPY.s2BarMeter, width: 280, color: COLORS.raised },
            ].map((bar, i) => (
              <div
                key={bar.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  marginTop: i === 0 ? 0 : 20,
                  opacity: interpolate(
                    frame,
                    [textAt + 10, textAt + 26],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: easeOut,
                    },
                  ),
                }}
              >
                <div
                  style={{
                    ...FONTS.mono,
                    fontSize: TYPE.monoSmall,
                    letterSpacing: "0.18em",
                    color: COLORS.soft,
                    width: 130,
                  }}
                >
                  {bar.label}
                </div>
                <div
                  style={{
                    width: bar.width,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: bar.color,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </SceneShell>
    </AbsoluteFill>
  );
};

const WINDOW_TOP = 170;
const PANEL_TOP = 1040;
