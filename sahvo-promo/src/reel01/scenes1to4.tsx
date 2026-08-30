import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../fonts";
import { easeOut } from "../components/motion";
import {
  DrawnPath,
  INDIA_PATH,
  LineIcon,
  MAP_POINTS,
  MapDot,
  Rickshaw,
} from "./assets";
import { R_BEATS, R_COLORS, R_LAYOUT, R_SCENES, R_TYPE } from "./constants";
import { RCanvas, RText } from "./ui";

const rel = (abs: number, scene: { start: number }) => abs - scene.start;

// ── SCENE 01 — INDIA IS WAITING (0–4s) ──────────────────────────────────────
export const R1India: React.FC = () => {
  const frame = useCurrentFrame();
  const mapIn = interpolate(frame, [2, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <RCanvas glowX={72} glowY={22}>
      <svg
        viewBox="0 0 560 620"
        style={{
          position: "absolute",
          left: 150,
          top: 290,
          width: 780,
          height: 863,
          opacity: mapIn,
        }}
      >
        <path d={INDIA_PATH} fill={R_COLORS.mist} stroke={R_COLORS.light} strokeWidth={2} />
        {/* Route drawing toward Jaipur */}
        <DrawnPath
          d={`M300 470 Q250 380 230 300 Q214 240 ${MAP_POINTS.jaipur.x} ${MAP_POINTS.jaipur.y}`}
          from={R_BEATS.r1PinPulse + 6}
          to={R_BEATS.r1RouteDone}
          dashed
        />
        <MapDot
          x={MAP_POINTS.jaipur.x}
          y={MAP_POINTS.jaipur.y}
          at={R_BEATS.r1PinPulse - 6}
          rippleAt={R_BEATS.r1PinPulse}
          r={11}
        />
      </svg>

      {/* Travel glyphs settling around the map */}
      {(
        [
          { kind: "plane", x: 812, y: 380, at: 60 },
          { kind: "suitcase", x: 140, y: 520, at: 70 },
          { kind: "camera", x: 830, y: 900, at: 80 },
        ] as const
      ).map((g) => (
        <div
          key={g.kind}
          style={{
            position: "absolute",
            left: g.x,
            top: g.y,
            opacity: interpolate(frame, [g.at, g.at + 14], [0, 0.8], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
            translate: `0px ${interpolate(frame, [g.at, g.at + 14], [16, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            })}px`,
          }}
        >
          <LineIcon kind={g.kind} color={R_COLORS.blue} size={52} />
        </div>
      ))}

      <div style={{ position: "absolute", left: R_LAYOUT.marginX, right: R_LAYOUT.marginX, top: 1210 }}>
        <RText text="India is waiting" at={R_BEATS.r1Text} />
        <RText text="to be explored." at={R_BEATS.r1Text + 6} />
      </div>
    </RCanvas>
  );
};

// ── SCENE 02 — THE QUESTIONS BEGIN (4–9s) ───────────────────────────────────
export const R2Questions: React.FC = () => {
  const frame = useCurrentFrame();
  const s = R_SCENES.r2;
  const rickX = interpolate(frame, [10, s.duration], [80, 560], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chip = (at: number) =>
    interpolate(frame, [at, at + 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });
  const rupeeAt = rel(R_BEATS.r2Rupee, s);
  const guideAt = rel(R_BEATS.r2Guide, s);
  const qAt = rel(R_BEATS.r2Questions, s);

  return (
    <RCanvas glowX={25} glowY={30}>
      {/* Simplified city band: arch-tier facade + rooftops in pale blue */}
      <svg
        viewBox="0 0 1080 560"
        style={{ position: "absolute", left: 0, top: 520, width: 1080, height: 560, opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}
      >
        {[0, 1, 2].map((tier) => {
          const cols = 7 - tier * 2;
          const w = 74;
          const x0 = (1080 - cols * (w + 12)) / 2;
          const y = 300 - tier * 110;
          return (
            <g key={tier}>
              <rect x={x0 - 30} y={y - 16} width={cols * (w + 12) + 48} height={140} rx={10} fill={tier % 2 ? R_COLORS.mist : R_COLORS.light} opacity={0.75} />
              {Array.from({ length: cols }).map((_, c) => (
                <path
                  key={c}
                  d={`M${x0 + c * (w + 12) + 6} ${y + 108} V${y + 34} Q${x0 + c * (w + 12) + 6} ${y + 10} ${x0 + c * (w + 12) + w / 2} ${y} Q${x0 + c * (w + 12) + w - 6} ${y + 10} ${x0 + c * (w + 12) + w - 6} ${y + 34} V${y + 108} Z`}
                  fill={R_COLORS.paper}
                  opacity={0.9}
                />
              ))}
            </g>
          );
        })}
        {/* Road */}
        <path d="M-40 520 Q300 420 620 452 Q880 478 1120 420" stroke={R_COLORS.light} strokeWidth={58} fill="none" strokeLinecap="round" />
        <path d="M-40 520 Q300 420 620 452 Q880 478 1120 420" stroke={R_COLORS.paper} strokeWidth={3} strokeDasharray="22 26" fill="none" />
      </svg>

      {/* Rickshaw travelling the road */}
      <div style={{ position: "absolute", left: rickX, top: 900, opacity: chip(8) }}>
        <Rickshaw size={170} />
      </div>

      {/* Uncertainty accumulating: fare, guide, crossing routes, questions */}
      <div style={{ position: "absolute", left: 130, top: 700, opacity: chip(rupeeAt), scale: String(0.8 + chip(rupeeAt) * 0.2) }}>
        <Badge label="₹" />
      </div>
      <div style={{ position: "absolute", left: 800, top: 640, opacity: chip(guideAt) }}>
        <Badge label="?" avatar />
      </div>
      <svg viewBox="0 0 1080 400" style={{ position: "absolute", left: 0, top: 1080, width: 1080, height: 400 }}>
        <DrawnPath d="M60 120 Q300 40 560 110 Q800 170 1020 90" from={qAt - 18} to={qAt + 24} dashed strokeWidth={2.5} />
        <DrawnPath d="M40 240 Q360 320 640 230 Q860 160 1040 250" from={qAt - 8} to={qAt + 34} dashed strokeWidth={2.5} stroke={R_COLORS.light} />
      </svg>
      {[
        { x: 250, y: 1140, at: qAt },
        { x: 760, y: 1240, at: qAt + 10 },
      ].map((q, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: q.x,
            top: q.y,
            ...FONTS.display,
            fontSize: 64,
            color: R_COLORS.blue,
            opacity: chip(q.at) * 0.9,
            translate: `0px ${(1 - chip(q.at)) * 20}px`,
          }}
        >
          ?
        </div>
      ))}

      <div style={{ position: "absolute", left: R_LAYOUT.marginX, right: R_LAYOUT.marginX, top: 300 }}>
        <RText text="But sometimes, travelling" at={rel(R_BEATS.r2Text, s)} size={R_TYPE.big} />
        <RText text="comes with questions." at={rel(R_BEATS.r2Text, s) + 6} size={R_TYPE.big} />
      </div>
    </RCanvas>
  );
};

const Badge: React.FC<{ label: string; avatar?: boolean }> = ({ label, avatar }) => (
  <div
    style={{
      width: 96,
      height: 96,
      borderRadius: "50%",
      backgroundColor: avatar ? R_COLORS.paper : R_COLORS.blue,
      border: `2.5px solid ${avatar ? R_COLORS.blue : "transparent"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 14px 34px rgba(11, 19, 32, 0.14)",
      ...FONTS.display,
      fontSize: 46,
      color: avatar ? R_COLORS.blue : R_COLORS.paper,
    }}
  >
    {label}
  </div>
);

// ── SCENE 03 — THE THREE QUESTIONS (9–16s) ──────────────────────────────────
export const R3Three: React.FC = () => {
  const frame = useCurrentFrame();
  const s = R_SCENES.r3;
  const q1 = rel(R_BEATS.q1Start, s); // 0
  const q2 = rel(R_BEATS.q2Start, s); // 60
  const q3 = rel(R_BEATS.q3Start, s); // 135

  const beat = (start: number, end: number) => {
    const enter = interpolate(frame, [start, start + 16], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });
    const exit = interpolate(frame, [end - 12, end], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });
    return { o: enter * exit, enter };
  };

  const b1 = beat(q1 + 2, q2);
  const b2 = beat(q2, q3);
  const b3 = { ...beat(q3, s.duration + 20), };

  const shieldPulse = interpolate(frame, [q3 + 24, q3 + 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <RCanvas glowX={50} glowY={70}>
      {/* Q1 — FARE */}
      <AbsoluteFill style={{ opacity: b1.o, translate: `${(1 - b1.enter) * 60}px 0px` }}>
        <div style={{ position: "absolute", left: 330, top: 480 }}>
          <Rickshaw size={220} />
        </div>
        <div style={{ position: "absolute", left: 620, top: 430 }}>
          <Badge label="₹" />
        </div>
        <div style={{ position: "absolute", left: R_LAYOUT.marginX, right: R_LAYOUT.marginX, top: QUESTION_Y }}>
          <RText text="How much should" at={q1 + 8} />
          <RText text="this ride cost?" at={q1 + 14} />
          <Underline at={q1 + 20} />
        </div>
      </AbsoluteFill>

      {/* Q2 — GUIDE */}
      <AbsoluteFill style={{ opacity: b2.o, translate: `0px ${(1 - b2.enter) * 50}px` }}>
        <div style={{ position: "absolute", left: 420, top: 420 }}>
          <AvatarWithBadge at={q2 + 14} />
        </div>
        <div style={{ position: "absolute", left: R_LAYOUT.marginX, right: R_LAYOUT.marginX, top: QUESTION_Y }}>
          <RText text="Can I trust" at={q2 + 8} />
          <RText text="this guide?" at={q2 + 14} />
          <Underline at={q2 + 20} />
        </div>
      </AbsoluteFill>

      {/* Q3 — SAFETY (calm: blue shield, navy SOS chip, no alarm language) */}
      <AbsoluteFill style={{ opacity: b3.o, translate: `0px ${(1 - b3.enter) * 50}px` }}>
        <div style={{ position: "absolute", left: 440, top: 400 }}>
          {shieldPulse > 0 && shieldPulse < 1 && (
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 10,
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: `2.5px solid ${R_COLORS.blue}`,
                scale: String(1 + shieldPulse * 0.8),
                opacity: 0.5 * (1 - shieldPulse),
              }}
            />
          )}
          <LineIcon kind="shield" size={200} color={R_COLORS.blue} drawFrom={q3 + 6} drawTo={q3 + 26} />
          <div style={{ position: "absolute", left: 62, top: 62 }}>
            <LineIcon kind="check" size={76} color={R_COLORS.blue} drawFrom={q3 + 26} drawTo={q3 + 36} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 480,
            top: 660,
            padding: "12px 26px",
            borderRadius: 18,
            backgroundColor: R_COLORS.navy,
            ...FONTS.mono,
            fontSize: R_TYPE.monoSmall,
            letterSpacing: "0.16em",
            color: R_COLORS.paper,
            opacity: interpolate(frame, [q3 + 34, q3 + 46], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          SOS
        </div>
        <div style={{ position: "absolute", left: R_LAYOUT.marginX, right: R_LAYOUT.marginX, top: QUESTION_Y }}>
          <RText text="What if something" at={q3 + 8} />
          <RText text="goes wrong?" at={q3 + 14} />
          <Underline at={q3 + 20} />
        </div>
      </AbsoluteFill>
    </RCanvas>
  );
};

const QUESTION_Y = 1060;

const Underline: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: interpolate(frame, [at, at + 20], [0, 150], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOut,
        }),
        height: 5,
        borderRadius: 2.5,
        backgroundColor: R_COLORS.blue,
        marginTop: 30,
      }}
    />
  );
};

const AvatarWithBadge: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const badge = interpolate(frame, [at, at + 12, at + 34, at + 44], [0, 1, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wobble = Math.sin(frame / 7) * interpolate(frame, [at + 20, at + 50], [0, 2.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "relative", rotate: `${wobble}deg` }}>
      <svg width={230} height={230} viewBox="0 0 48 48">
        <circle cx={24} cy={24} r={23} fill={R_COLORS.mist} />
        <circle cx={24} cy={19} r={7.5} fill={R_COLORS.blue} opacity={0.85} />
        <path d="M10 40 Q13 29 24 29 Q35 29 38 40 Z" fill={R_COLORS.blue} opacity={0.85} />
      </svg>
      <div
        style={{
          position: "absolute",
          right: -8,
          bottom: 10,
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: R_COLORS.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: badge,
        }}
      >
        <LineIcon kind="check" size={40} color={R_COLORS.paper} />
      </div>
      <div
        style={{
          position: "absolute",
          right: -30,
          top: -10,
          ...FONTS.display,
          fontSize: 58,
          color: R_COLORS.blue,
          opacity: interpolate(frame, [at + 38, at + 50], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        ?
      </div>
    </div>
  );
};

// ── SCENE 04 — THE IDEA (16–20s) ────────────────────────────────────────────
export const R4Idea: React.FC = () => {
  const frame = useCurrentFrame();
  const s = R_SCENES.r4;
  const textAt = rel(R_BEATS.r4Text, s); // 60

  const straighten = interpolate(frame, [12, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const qMark = interpolate(frame, [26, 40, 58, 72], [0, 0.9, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // A winding path relaxing toward a straight line.
  const bend = (1 - straighten) * 130;
  const d = `M140 ${840} Q ${340} ${840 - bend} 540 840 Q ${740} ${840 + bend} 940 840`;

  return (
    <RCanvas glowX={50} glowY={44}>
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <path d={d} stroke={R_COLORS.blue} strokeWidth={4} fill="none" strokeLinecap="round" />
        <circle cx={140} cy={840} r={11} fill={R_COLORS.blue} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 480,
          textAlign: "center",
          ...FONTS.display,
          fontSize: 180,
          color: R_COLORS.blue,
          opacity: qMark,
        }}
      >
        ?
      </div>
      <div style={{ position: "absolute", left: R_LAYOUT.marginX, right: R_LAYOUT.marginX, top: 1000 }}>
        <RText text="What if you didn't have to" at={textAt} size={R_TYPE.big} />
        <RText text="figure it all out yourself?" at={textAt + 8} size={R_TYPE.big} />
      </div>
    </RCanvas>
  );
};
