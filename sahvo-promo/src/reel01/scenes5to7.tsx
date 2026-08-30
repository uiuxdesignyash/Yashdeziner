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
import { Avatar, DrawnPath, INDIA_PATH, LineIcon, MAP_POINTS, MapDot, RAJASTHAN_PATH } from "./assets";
import { R_BEATS, R_COLORS, R_LAYOUT, R_SCENES, R_TYPE } from "./constants";
import { MaskedAmount, RCanvas, RCard, RMono, RText } from "./ui";

const rel = (abs: number, scene: { start: number }) => abs - scene.start;

// ── SCENE 05 — MEET SAHVO (20–26s) ──────────────────────────────────────────
// The white wordmark lives on Sahvo Blue (the only logo asset supplied is
// white-on-transparent), so the reveal happens on a blue wash that settles
// into a band, with the product cards below on off-white.
export const R5Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const s = R_SCENES.r5;
  const washAt = rel(R_BEATS.r5Wash, s); // 30
  const logoAt = rel(R_BEATS.r5Logo, s); // 60
  const meetAt = rel(R_BEATS.r5MeetText, s); // 75
  const fareAt = rel(R_BEATS.r5FareCard, s); // 120
  const guideAt = rel(R_BEATS.r5GuideCard, s); // 150

  // Blue wash: expands from the route head to cover, then settles to a band.
  const cover = interpolate(frame, [washAt, washAt + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const settle = interpolate(frame, [logoAt + 34, logoAt + 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const bandTop = interpolate(settle, [0, 1], [0, BAND_TOP]);
  const bandBottom = interpolate(settle, [0, 1], [1920, BAND_TOP + BAND_H]);
  const bandRadius = settle * 44;

  const logoW = 560;
  const logoH = logoW * BRAND.logoAspect;
  const logoP = interpolate(frame, [logoAt, logoAt + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  // The lockup rides with the wash as it settles into the band.
  const logoY = interpolate(settle, [0, 1], [770, BAND_TOP + 120]);

  return (
    <RCanvas glowX={50} glowY={80}>
      {/* Route line sweeping in, carrying the transition */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <DrawnPath
          d="M-40 900 Q260 840 540 880 Q760 910 1120 850"
          from={0}
          to={washAt + 4}
          strokeWidth={5}
        />
      </svg>

      {/* The wash */}
      <div
        style={{
          position: "absolute",
          left: settle * R_LAYOUT.marginX * 0 /* full-bleed band */,
          right: 0,
          top: bandTop,
          height: bandBottom - bandTop,
          width: "100%",
          borderRadius: bandRadius,
          backgroundColor: R_COLORS.blue,
          scale: String(cover),
          transformOrigin: "540px 880px",
          opacity: cover > 0 ? 1 : 0,
        }}
      />

      {/* ACTUAL wordmark — white on the blue wash, one object */}
      <Img
        src={staticFile(BRAND.logo)}
        style={{
          position: "absolute",
          left: (1080 - logoW) / 2,
          top: logoY,
          width: logoW,
          height: logoH,
          opacity: logoP,
          scale: String(0.94 + logoP * 0.06),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: interpolate(settle, [0, 1], [770 + logoH + 70, BAND_TOP + 120 + logoH + 54]),
          textAlign: "center",
        }}
      >
        <RText
          text="Meet Sahvo."
          at={meetAt}
          size={64}
          color={R_COLORS.paper}
          align="center"
        />
        <div style={{ display: "flex", justifyContent: "center", gap: 26, marginTop: 22 }}>
          <RText text="Know the fare." at={meetAt + 40} size={R_TYPE.body} weight="body" color="rgba(255,255,255,0.85)" />
          <RText text="Know the guide." at={meetAt + 48} size={R_TYPE.body} weight="body" color="rgba(255,255,255,0.85)" />
        </div>
      </div>

      {/* Product cards below the band, stylised motion-graphic UI */}
      <div style={{ position: "absolute", left: R_LAYOUT.marginX, top: CARDS_TOP }}>
        <RCard at={fareAt} width={540}>
          <RMono text="ESTIMATED FARE" at={fareAt + 6} />
          <div style={{ marginTop: 20 }}>
            <MaskedAmount at={fareAt + 10} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
            <LineIcon kind="shield" size={34} color={R_COLORS.blue} />
            <span style={{ ...FONTS.body, fontSize: 26, color: R_COLORS.inkSoft }}>
              Priced before, not after.
            </span>
          </div>
        </RCard>
      </div>
      <div style={{ position: "absolute", right: R_LAYOUT.marginX, top: CARDS_TOP + 270 }}>
        <RCard at={guideAt} width={540}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Avatar size={92} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ ...FONTS.display, fontSize: 34, color: R_COLORS.navy }}>
                  Verified Guide
                </span>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    backgroundColor: R_COLORS.blue,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LineIcon kind="check" size={20} color={R_COLORS.paper} />
                </span>
              </div>
              <RMono text="ID VERIFIED · BACKGROUND CHECKED" at={guideAt + 10} style={{ marginTop: 10 }} />
            </div>
          </div>
        </RCard>
      </div>
    </RCanvas>
  );
};

const BAND_TOP = 210;
const BAND_H = 700;
const CARDS_TOP = 990;

// ── SCENE 06 — STARTING IN JAIPUR, BUILDING FOR INDIA (26–31s) ─────────────
export const R6Expand: React.FC = () => {
  const frame = useCurrentFrame();
  const s = R_SCENES.r6;
  const jaipurAt = rel(R_BEATS.r6Jaipur, s); // 6
  const rajAt = rel(R_BEATS.r6Rajasthan, s); // 32
  const expandAt = rel(R_BEATS.r6Expand, s); // 60
  const dotsAt = rel(R_BEATS.r6AllIndia, s); // 95
  const pullAt = rel(R_BEATS.r6PullBack, s); // 120

  const pull = interpolate(frame, [expandAt, pullAt + 24], [1.55, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const raj = interpolate(frame, [rajAt, rajAt + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const J = MAP_POINTS.jaipur;
  const routes: { to: keyof typeof MAP_POINTS; from: number }[] = [
    { to: "delhi", from: expandAt },
    { to: "ahmedabad", from: expandAt + 8 },
    { to: "mumbai", from: expandAt + 16 },
    { to: "kolkata", from: dotsAt },
    { to: "hyderabad", from: dotsAt + 6 },
    { to: "bangalore", from: dotsAt + 12 },
    { to: "chennai", from: dotsAt + 18 },
  ];

  return (
    <RCanvas glowX={60} glowY={30}>
      <svg
        viewBox="0 0 560 620"
        style={{
          position: "absolute",
          left: 150,
          top: 300,
          width: 780,
          height: 863,
          scale: String(pull),
          transformOrigin: `${((J.x - 0) / 560) * 100}% ${((J.y - 0) / 620) * 100}%`,
          opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <path d={INDIA_PATH} fill={R_COLORS.mist} stroke={R_COLORS.light} strokeWidth={2} />
        <path d={RAJASTHAN_PATH} fill={R_COLORS.light} opacity={raj * 0.9} />
        {routes.map((r) => {
          const P = MAP_POINTS[r.to];
          const mx = (J.x + P.x) / 2 + (P.y > J.y ? 24 : -18);
          const my = (J.y + P.y) / 2 - 18;
          return (
            <g key={r.to}>
              <DrawnPath d={`M${J.x} ${J.y} Q${mx} ${my} ${P.x} ${P.y}`} from={r.from} to={r.from + 22} dashed strokeWidth={2.6} />
              <MapDot x={P.x} y={P.y} at={r.from + 18} r={6.5} />
            </g>
          );
        })}
        {/* Jaipur: the brand pin (white) in a blue roundel */}
        <circle cx={J.x} cy={J.y} r={interpolate(frame, [jaipurAt, jaipurAt + 12], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut })} fill={R_COLORS.blue} />
      </svg>
      {/* Brand pin overlaid at Jaipur (screen space, follows the settled map) */}
      <PinAtJaipur at={jaipurAt} pull={pull} />

      <div style={{ position: "absolute", left: R_LAYOUT.marginX, right: R_LAYOUT.marginX, top: 1210 }}>
        <SwapText
          a="Starting in Jaipur."
          b="Building for India."
          aAt={rel(R_BEATS.r6Text1, s)}
          bAt={rel(R_BEATS.r6Text2, s)}
        />
      </div>
    </RCanvas>
  );
};

const PinAtJaipur: React.FC<{ at: number; pull: number }> = ({ at, pull }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: frame - at, fps, config: { damping: 14, mass: 0.8 }, durationInFrames: 24 });
  const h = 96;
  const w = h * BRAND.pinAspect;
  // The map scales around Jaipur, so Jaipur's screen position is fixed.
  const x = 150 + (MAP_POINTS.jaipur.x / 560) * 780;
  const y = 300 + (MAP_POINTS.jaipur.y / 620) * 863;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h + 6,
        width: w,
        height: h,
        opacity: Math.min(drop * 1.5, 1) * (pull > 0 ? 1 : 1),
        translate: `0px ${(drop - 1) * 160}px`,
        filter: "drop-shadow(0 10px 18px rgba(11,19,32,0.3))",
      }}
    >
      <Img src={staticFile(BRAND.pin)} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

const SwapText: React.FC<{ a: string; b: string; aAt: number; bAt: number }> = ({ a, b, aAt, bAt }) => {
  const frame = useCurrentFrame();
  const aOut = interpolate(frame, [bAt - 12, bAt - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "relative", height: 110 }}>
      <div style={{ position: "absolute", inset: 0, opacity: aOut }}>
        <RText text={a} at={aAt} />
      </div>
      <div style={{ position: "absolute", inset: 0 }}>
        <RText text={b} at={bAt} />
      </div>
    </div>
  );
};

// ── SCENE 07 — END CARD (31–35s) ────────────────────────────────────────────
export const R7End: React.FC = () => {
  const frame = useCurrentFrame();
  const s = R_SCENES.r7;
  const logoAt = rel(R_BEATS.r7Logo, s); // 30
  const tagAt = rel(R_BEATS.r7Tagline, s); // 62
  const urlAt = rel(R_BEATS.r7Url, s); // 90
  const stillAt = rel(R_BEATS.r7AllStill, s); // 102

  const logoW = 520;
  const logoH = logoW * BRAND.logoAspect;
  const clearSpace = 600 * (logoW / 1988); // one pin-glyph height at scale

  const mark = spring({
    frame: Math.min(frame, stillAt) - logoAt,
    fps: 30,
    config: { damping: 200 },
    durationInFrames: 26,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: R_COLORS.navy }}>
      <AbsoluteFill
        style={{
          backgroundColor: R_COLORS.canvas,
          opacity: interpolate(frame, [0, 18], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          }),
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 22% at 50% 44%, rgba(29, 78, 216, ${
            0.16 * Math.min(interpolate(frame, [logoAt, stillAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), 1)
          }) 0%, transparent 70%)`,
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
        text="Know. Go. Trust."
        at={tagAt}
        size={52}
        color="#F4F7FC"
        align="center"
        style={{ position: "absolute", left: 0, right: 0, top: LOGO_TOP + logoH + clearSpace }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: LOGO_TOP + logoH + clearSpace + 130,
          textAlign: "center",
          opacity: interpolate(frame, [urlAt, urlAt + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <RMono text="FOLLOW THE JOURNEY" color="#8FB0FF" style={{ justifySelf: "center" }} />
        <div style={{ ...FONTS.display, fontSize: 58, color: "#F4F7FC", marginTop: 26 }}>
          sahvoapp.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

const LOGO_TOP = 720;
