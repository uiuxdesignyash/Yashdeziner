import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONTS } from "../fonts";
import { easeOut } from "../components/motion";
import { DrawnPath, LineIcon, MapDot } from "./assets";
import { GEO, IndiaMapReal } from "./IndiaMapReal";
import { ART, R_BEATS, R_COLORS, R_COPY, R_LAYOUT, R_SCENES, R_TYPE } from "./constants";
import { Plate, RCanvas, RMono, RText, TextPanel } from "./ui";

const rel = (abs: number, scene: { start: number }) => abs - scene.start;

// Real map placement shared by R1/R6: scaled 0.87, inside the margins.
export const MAP_SCALE = 0.87;
export const MAP_LEFT = (1080 - 900 * MAP_SCALE) / 2; // 148.5
export const MAP_TOP = 280;
export const jaipurScreen = {
  x: MAP_LEFT + GEO.jaipur.x * MAP_SCALE,
  y: MAP_TOP + GEO.jaipur.y * MAP_SCALE,
};

// ── SCENE 01 — INDIA IS WAITING (0–4s) ──────────────────────────────────────
export const R1India: React.FC = () => {
  const frame = useCurrentFrame();
  const mapIn = interpolate(frame, [2, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <RCanvas scene="r1">
      <div style={{ position: "absolute", left: MAP_LEFT, top: MAP_TOP, opacity: mapIn }}>
        <IndiaMapReal
          fill={R_COLORS.surface}
          stroke="rgba(143, 176, 255, 0.45)"
          style={{ scale: String(MAP_SCALE), transformOrigin: "top left" }}
        >
          <DrawnPath
            d={`M${GEO.chennai.x} ${GEO.chennai.y} Q ${GEO.hyderabad.x - 30} ${GEO.hyderabad.y} ${GEO.ahmedabad.x + 60} ${(GEO.ahmedabad.y + GEO.jaipur.y) / 2} Q ${GEO.jaipur.x - 20} ${GEO.jaipur.y + 60} ${GEO.jaipur.x} ${GEO.jaipur.y}`}
            from={R_BEATS.r1PinPulse + 4}
            to={R_BEATS.r1RouteDone}
            dashed
          />
          <MapDot x={GEO.jaipur.x} y={GEO.jaipur.y} at={R_BEATS.r1PinPulse - 6} rippleAt={R_BEATS.r1PinPulse} r={11} />
        </IndiaMapReal>
      </div>

      {/* Travel glyphs settling around the map — inside the margins */}
      {(
        [
          { kind: "plane", x: 860, y: 380, at: 60 },
          { kind: "suitcase", x: 130, y: 480, at: 70 },
          { kind: "camera", x: 880, y: 1010, at: 80 },
        ] as const
      ).map((g) => (
        <div
          key={g.kind}
          style={{
            position: "absolute",
            left: g.x,
            top: g.y,
            opacity: interpolate(frame, [g.at, g.at + 14], [0, 0.85], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
          }}
        >
          <LineIcon kind={g.kind} size={50} />
        </div>
      ))}

      <TextPanel at={R_BEATS.r1Text - 8} top={1170}>
        <RText lines={R_COPY.r1} at={R_BEATS.r1Text} size={72} />
      </TextPanel>
    </RCanvas>
  );
};

// ── SCENE 02 — THE QUESTIONS BEGIN (4–9s) ───────────────────────────────────
export const R2Questions: React.FC = () => {
  const frame = useCurrentFrame();
  const s = R_SCENES.r2;
  const rupeeAt = rel(R_BEATS.r2Rupee, s);
  const guideAt = rel(R_BEATS.r2Guide, s);
  const qAt = rel(R_BEATS.r2Questions, s);

  const fade = (at: number, to = 1) =>
    interpolate(frame, [at, at + 14], [0, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });

  return (
    <RCanvas scene="r2">
      <TextPanel at={4} top={268}>
        <RText lines={R_COPY.r2} at={rel(R_BEATS.r2Text, s)} size={64} />
      </TextPanel>

      {/* The asset-sheet Jaipur skyline, alpha-lifted onto the navy */}
      <div
        style={{
          position: "absolute",
          left: R_LAYOUT.marginX,
          width: R_LAYOUT.contentRight - R_LAYOUT.marginX,
          top: 560,
          opacity: fade(10, 0.9),
          translate: `${interpolate(frame, [0, s.duration], [0, -22])}px 0px`,
        }}
      >
        <Img src={staticFile(ART.city)} style={{ width: "100%" }} />
      </div>

      {/* Rickshaw plate rolling gently */}
      <div
        style={{
          position: "absolute",
          left: interpolate(frame, [10, s.duration], [116, 200], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          top: 880,
          opacity: fade(12),
        }}
      >
        <Plate art={ART.rickshaw} at={12} left={0} top={0} width={330} tilt={-2} />
      </div>

      {/* ₹ badge and guide plate arriving — the uncertainty accumulating */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 900,
          width: 104,
          height: 104,
          borderRadius: "50%",
          backgroundColor: R_COLORS.brand,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 34px rgba(11, 83, 255, 0.5)",
          ...FONTS.display,
          fontSize: 48,
          color: R_COLORS.ink,
          opacity: fade(rupeeAt),
          scale: String(0.7 + fade(rupeeAt) * 0.3),
        }}
      >
        ₹
      </div>
      <Plate art={ART.guideCircle} at={guideAt} left={730} top={860} width={190} circle />

      {/* Routes crossing + question marks */}
      <svg
        viewBox="0 0 888 300"
        style={{ position: "absolute", left: R_LAYOUT.marginX, top: 1140, width: 888, height: 300 }}
      >
        <DrawnPath d="M20 90 Q240 20 470 84 Q690 140 868 60" from={qAt - 16} to={qAt + 22} dashed strokeWidth={2.5} />
        <DrawnPath d="M10 200 Q300 260 540 190 Q740 130 878 210" from={qAt - 6} to={qAt + 32} dashed strokeWidth={2.5} stroke={R_COLORS.soft} />
      </svg>
      {[
        { x: 300, y: 1180, at: qAt },
        { x: 730, y: 1260, at: qAt + 8 },
      ].map((q, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: q.x,
            top: q.y,
            ...FONTS.display,
            fontSize: 60,
            color: R_COLORS.soft,
            opacity: fade(q.at, 0.9),
            translate: `0px ${(1 - fade(q.at)) * 20}px`,
          }}
        >
          ?
        </div>
      ))}
    </RCanvas>
  );
};

// ── SCENE 03 — THE THREE QUESTIONS (9–16s) ──────────────────────────────────
export const R3Three: React.FC = () => {
  const frame = useCurrentFrame();
  const s = R_SCENES.r3;
  const q1 = rel(R_BEATS.q1Start, s); // 0
  const q2 = rel(R_BEATS.q2Start, s); // 60
  const q3 = rel(R_BEATS.q3Start, s); // 135

  const beat = (start: number, end: number) => {
    const enter = interpolate(frame, [start, start + 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });
    const exit = interpolate(frame, [end - 10, end], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });
    return { o: enter * exit, enter };
  };

  const b1 = beat(q1 + 2, q2);
  const b2 = beat(q2, q3);
  const b3 = beat(q3, s.duration + 20);

  const sosPulse = interpolate(frame, [q3 + 30, q3 + 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const Q = ({ lines, at }: { lines: readonly string[]; at: number }) => (
    <TextPanel at={at + 4} top={1080}>
      <RText lines={lines} at={at + 8} />
    </TextPanel>
  );

  return (
    <RCanvas scene="r3">
      {/* Q1 — FARE */}
      <AbsoluteFill style={{ opacity: b1.o, translate: `0px ${(1 - b1.enter) * 40}px` }}>
        <Plate art={ART.autoCircle} at={q1 + 4} left={200} top={420} width={330} circle />
        <Plate art={ART.fareMini} at={q1 + 18} left={560} top={560} width={330} tilt={2} pad={0} />
        <Q lines={R_COPY.q1} at={q1} />
      </AbsoluteFill>

      {/* Q2 — GUIDE */}
      <AbsoluteFill style={{ opacity: b2.o, translate: `0px ${(1 - b2.enter) * 40}px` }}>
        <Plate art={ART.guidePortrait} at={q2 + 4} left={370} top={420} width={340} circle />
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 700,
            ...FONTS.display,
            fontSize: 78,
            color: R_COLORS.soft,
            opacity: interpolate(frame, [q2 + 26, q2 + 40], [0, 0.9], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          ?
        </div>
        <Q lines={R_COPY.q2} at={q2} />
      </AbsoluteFill>

      {/* Q3 — SAFETY: the sheet's shield (red removed at source), calm */}
      <AbsoluteFill style={{ opacity: b3.o, translate: `0px ${(1 - b3.enter) * 40}px` }}>
        {sosPulse > 0 && sosPulse < 1 && (
          <div
            style={{
              position: "absolute",
              left: 375,
              top: 425,
              width: 330,
              height: 330,
              borderRadius: "50%",
              border: `2.5px solid ${R_COLORS.brand}`,
              scale: String(1 + sosPulse * 0.5),
              opacity: 0.5 * (1 - sosPulse),
            }}
          />
        )}
        <Plate art={ART.shield} at={q3 + 4} left={375} top={425} width={330} circle />
        <div
          style={{
            position: "absolute",
            left: 490,
            top: 800,
            padding: "12px 26px",
            borderRadius: 18,
            backgroundColor: R_COLORS.raised,
            border: `1px solid ${R_COLORS.surface}`,
            ...FONTS.mono,
            fontSize: R_TYPE.monoSmall,
            letterSpacing: "0.16em",
            color: R_COLORS.ink,
            opacity: interpolate(frame, [q3 + 34, q3 + 46], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          SOS
        </div>
        <Q lines={R_COPY.q3} at={q3} />
      </AbsoluteFill>
    </RCanvas>
  );
};

// ── SCENE 04 — THE IDEA (16–20s) ────────────────────────────────────────────
export const R4Idea: React.FC = () => {
  const frame = useCurrentFrame();
  const s = R_SCENES.r4;
  const textAt = rel(R_BEATS.r4Text, s); // 60

  const heroIn = interpolate(frame, [6, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <RCanvas scene="r4">
      {/* The sheet's glowing question-route hero — already a dark plate */}
      <div
        style={{
          position: "absolute",
          left: (1080 - 620) / 2,
          top: 300,
          width: 620,
          borderRadius: 40,
          overflow: "hidden",
          border: `1px solid ${R_COLORS.raised}`,
          boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
          opacity: heroIn,
          translate: `0px ${(1 - heroIn) * 40 + Math.sin(frame / 90) * 5}px`,
          lineHeight: 0,
        }}
      >
        <Img src={staticFile(ART.questionHero)} style={{ width: "100%" }} />
      </div>

      <TextPanel at={textAt - 8} top={1010}>
        <RText lines={R_COPY.r4} at={textAt} size={64} />
        <RMono text="CLEAN · CALM · FOCUSED" at={textAt + 26} style={{ marginTop: 26 }} />
      </TextPanel>
    </RCanvas>
  );
};
