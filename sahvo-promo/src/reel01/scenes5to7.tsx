import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONTS } from "../fonts";
import { easeOut } from "../components/motion";
import { BRAND } from "../constants";
import { DrawnPath, MapDot } from "./assets";
import { GEO, IndiaMapReal } from "./IndiaMapReal";
import { MAP_LEFT, MAP_SCALE, MAP_TOP, jaipurScreen } from "./scenes1to4";
import { ART, R_BEATS, R_COLORS, R_COPY, R_LAYOUT, R_SCENES, R_TYPE } from "./constants";
import { Plate, RCanvas, RMono, RText, TextPanel } from "./ui";

const rel = (abs: number, scene: { start: number }) => abs - scene.start;

// ── SCENE 05 — MEET SAHVO (20–26s) ──────────────────────────────────────────
export const R5Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const s = R_SCENES.r5;
  const washAt = rel(R_BEATS.r5Wash, s); // 30
  const logoAt = rel(R_BEATS.r5Logo, s); // 60
  const meetAt = rel(R_BEATS.r5MeetText, s); // 75
  const fareAt = rel(R_BEATS.r5FareCard, s); // 115
  const guideAt = rel(R_BEATS.r5GuideCard, s); // 142

  const wash = interpolate(frame, [washAt, washAt + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const logoW = 500;
  const logoH = logoW * BRAND.logoAspect;
  const logoP = interpolate(frame, [logoAt, logoAt + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <RCanvas scene="r5">
      {/* Route line carrying the transition into the wash */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <DrawnPath d="M96 560 Q340 480 540 520 Q760 560 984 470" from={0} to={washAt + 2} strokeWidth={5} />
      </svg>

      {/* The brand-blue wash panel — inside the margins */}
      <div
        style={{
          position: "absolute",
          left: R_LAYOUT.marginX,
          width: R_LAYOUT.contentRight - R_LAYOUT.marginX,
          top: 268,
          height: 560,
          borderRadius: 44,
          backgroundColor: R_COLORS.brand,
          boxShadow: "0 30px 80px rgba(11, 83, 255, 0.35)",
          opacity: wash,
          scale: String(0.9 + wash * 0.1),
          transformOrigin: "50% 60%",
        }}
      >
        <Img
          src={staticFile(BRAND.logo)}
          style={{
            position: "absolute",
            left: (888 - logoW) / 2,
            top: 96,
            width: logoW,
            height: logoH,
            opacity: logoP,
            scale: String(0.94 + logoP * 0.06),
          }}
        />
        <div style={{ position: "absolute", left: 0, right: 0, top: 96 + logoH + 54, textAlign: "center" }}>
          <RText lines={[R_COPY.r5Meet]} at={meetAt} size={58} align="center" />
          <div
            style={{
              ...FONTS.body,
              fontSize: R_TYPE.body,
              color: "rgba(244, 247, 252, 0.88)",
              marginTop: 20,
              opacity: interpolate(frame, [meetAt + 34, meetAt + 50], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeOut,
              }),
            }}
          >
            {R_COPY.r5Know}
          </div>
          <RMono
            text={R_COPY.r5Status}
            at={meetAt + 50}
            color="rgba(244, 247, 252, 0.75)"
            style={{ marginTop: 26, display: "inline-block" }}
          />
        </div>
      </div>

      {/* Product cards from the asset sheets, figures masked at source */}
      <Plate art={ART.fareCard} at={fareAt} left={R_LAYOUT.marginX} top={880} width={430} tilt={-1.5} />
      <Plate art={ART.guideCard} at={guideAt} left={R_LAYOUT.contentRight - 480} top={1010} width={480} tilt={1.5} />
    </RCanvas>
  );
};

// ── SCENE 06 — STARTING IN JAIPUR, BUILDING FOR INDIA (26–31s) ─────────────
export const R6Expand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = R_SCENES.r6;
  const pinAt = rel(R_BEATS.r6PinDrop, s); // 20
  const rajAt = rel(R_BEATS.r6Rajasthan, s); // 35
  const expandAt = rel(R_BEATS.r6Expand, s); // 65
  const dotsAt = rel(R_BEATS.r6AllIndia, s); // 98

  const raj = interpolate(frame, [rajAt, rajAt + 18], [0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The real pin glyph falls with a spring onto the true coordinate.
  const drop = spring({
    frame: frame - pinAt,
    fps,
    config: { damping: 14, mass: 0.85 },
    durationInFrames: 26,
  });
  const rippleP = interpolate(frame, [pinAt + 4, pinAt + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pinH = 220;
  const pinW = pinH * BRAND.pinAspect;

  const J = GEO.jaipur;
  const routes: { to: { x: number; y: number }; from: number }[] = [
    { to: GEO.delhi, from: expandAt },
    { to: GEO.ahmedabad, from: expandAt + 8 },
    { to: GEO.mumbai, from: expandAt + 16 },
    { to: GEO.kolkata, from: dotsAt },
    { to: GEO.hyderabad, from: dotsAt + 6 },
    { to: GEO.bengaluru, from: dotsAt + 12 },
    { to: GEO.chennai, from: dotsAt + 18 },
  ];

  return (
    <RCanvas scene="r6">
      {/* Clouds + a landmark from the sheets as quiet texture */}
      <Img
        src={staticFile(ART.clouds)}
        style={{ position: "absolute", left: 130, top: 300, width: 200, opacity: 0.5 }}
      />
      <Img
        src={staticFile(ART.lmHawaMahal)}
        style={{ position: "absolute", left: R_LAYOUT.marginX, top: 968, width: 190, opacity: 0.5 }}
      />
      <Img
        src={staticFile(ART.lmAmberFort)}
        style={{ position: "absolute", left: R_LAYOUT.contentRight - 200, top: 975, width: 185, opacity: 0.45 }}
      />

      <div
        style={{
          position: "absolute",
          left: MAP_LEFT,
          top: MAP_TOP,
          opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <IndiaMapReal
          fill={R_COLORS.surface}
          stroke="rgba(143, 176, 255, 0.45)"
          rajasthanFill={R_COLORS.brand}
          rajasthanOpacity={raj}
          style={{ scale: String(MAP_SCALE), transformOrigin: "top left" }}
        >
          {routes.map((r, i) => {
            const mx = (J.x + r.to.x) / 2 + (r.to.y > J.y ? 26 : -20);
            const my = (J.y + r.to.y) / 2 - 20;
            return (
              <g key={i}>
                <DrawnPath
                  d={`M${J.x} ${J.y} Q${mx} ${my} ${r.to.x} ${r.to.y}`}
                  from={r.from}
                  to={r.from + 22}
                  dashed
                  strokeWidth={2.6}
                />
                <MapDot x={r.to.x} y={r.to.y} at={r.from + 18} r={7} />
              </g>
            );
          })}
          <MapDot x={J.x} y={J.y} at={pinAt - 4} r={10} />
        </IndiaMapReal>
      </div>

      {/* One expanding ripple at the landing */}
      {rippleP > 0 && rippleP < 1 && (
        <div
          style={{
            position: "absolute",
            left: jaipurScreen.x - 46,
            top: jaipurScreen.y - 20,
            width: 92,
            height: 40,
            borderRadius: "50%",
            border: `3px solid ${R_COLORS.brand}`,
            scale: String(1 + rippleP * 3.4),
            opacity: 0.7 * (1 - rippleP),
          }}
        />
      )}
      {/* The REAL pin glyph, tip on 26.9124°N 75.7873°E */}
      <div
        style={{
          position: "absolute",
          left: jaipurScreen.x - pinW / 2,
          top: jaipurScreen.y - pinH,
          width: pinW,
          height: pinH,
          opacity: Math.min(drop * 1.6, 1),
          translate: `0px ${(drop - 1) * 320}px`,
          filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.55))",
        }}
      >
        <Img src={staticFile(BRAND.pin)} style={{ width: "100%", height: "100%" }} />
      </div>

      <TextPanel at={rel(R_BEATS.r6Text1, s) - 8} top={1180}>
        <div style={{ position: "relative", height: 100 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: interpolate(frame, [rel(R_BEATS.r6Text2, s) - 12, rel(R_BEATS.r6Text2, s) - 2], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <RText lines={[R_COPY.r6a]} at={rel(R_BEATS.r6Text1, s)} />
          </div>
          <RText lines={[R_COPY.r6b]} at={rel(R_BEATS.r6Text2, s)} style={{ position: "absolute", inset: 0 }} />
        </div>
      </TextPanel>
    </RCanvas>
  );
};

// ── SCENE 07 — END CARD (31–35s) ────────────────────────────────────────────
export const R7End: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = R_SCENES.r7;
  const logoAt = rel(R_BEATS.r7Logo, s); // 28
  const tagAt = rel(R_BEATS.r7Tagline, s); // 58
  const urlAt = rel(R_BEATS.r7Url, s); // 78
  const stillAt = rel(R_BEATS.r7AllStill, s); // 100

  const logoW = 520;
  const logoH = logoW * BRAND.logoAspect; // ≈172
  const clearSpace = 600 * (logoW / 1988); // ≈157 — one pin-glyph height

  const mark = spring({
    frame: Math.min(frame, stillAt) - logoAt,
    fps,
    config: { damping: 200 },
    durationInFrames: 26,
  });
  const glow = interpolate(Math.min(frame, stillAt), [logoAt, logoAt + 16, stillAt], [0, 0.3, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <RCanvas scene="r7">
      <AbsoluteFill
        style={{
          background: `radial-gradient(48% 20% at 50% 36%, rgba(11, 83, 255, ${glow}) 0%, transparent 70%)`,
        }}
      />
      <Img
        src={staticFile(BRAND.logo)}
        style={{
          position: "absolute",
          left: (1080 - logoW) / 2,
          top: LOGO_TOP,
          width: logoW,
          height: logoH,
          opacity: mark,
          scale: String(0.94 + mark * 0.06),
        }}
      />
      <RText
        lines={[R_COPY.r7Tag]}
        at={tagAt}
        size={50}
        align="center"
        style={{ position: "absolute", left: 0, right: 0, top: LOGO_TOP + logoH + clearSpace }}
      />
      {/* sahvoapp.com at the vertical centre of the frame */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 924,
          textAlign: "center",
          opacity: interpolate(frame, [urlAt, urlAt + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          }),
        }}
      >
        <div style={{ ...FONTS.display, fontSize: 64, color: R_COLORS.ink }}>{R_COPY.r7Url}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1090,
          textAlign: "center",
          opacity: interpolate(frame, [urlAt + 8, urlAt + 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <RMono text={R_COPY.r7Follow} style={{ display: "inline-block" }} />
        <div style={{ marginTop: 24 }}>
          <RMono text={R_COPY.r7Status} at={urlAt + 14} style={{ display: "inline-block" }} />
        </div>
      </div>
    </RCanvas>
  );
};

const LOGO_TOP = 480;
