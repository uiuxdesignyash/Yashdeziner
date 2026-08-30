import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BRAND, COLORS } from "../constants";
import { FONTS } from "../fonts";
import { GEO, IndiaMapReal, MAP_W } from "./IndiaMapReal";

// STEP-1 VERIFICATION FRAME (static): the real Natural Earth-derived India
// outline in the dark system, Rajasthan highlighted as its actual state
// polygon, and the real pin glyph landed on Jaipur's true projected
// coordinate (26.9124°N, 75.7873°E).
export const MapCheck: React.FC = () => {
  const mapLeft = (1080 - MAP_W) / 2;
  const mapTop = 330;
  const pinH = 220;
  const pinW = pinH * BRAND.pinAspect;
  const jaipurX = mapLeft + GEO.jaipur.x;
  const jaipurY = mapTop + GEO.jaipur.y;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 40% at 60% 30%, rgba(11, 83, 255, 0.16) 0%, transparent 70%)`,
        }}
      />
      <IndiaMapReal
        fill={COLORS.surface}
        stroke="rgba(143, 176, 255, 0.5)"
        rajasthanFill={COLORS.brand}
        rajasthanOpacity={0.4}
        style={{ position: "absolute", left: mapLeft, top: mapTop }}
      />
      {/* Ripple ring at the exact coordinate */}
      <div
        style={{
          position: "absolute",
          left: jaipurX - 44,
          top: jaipurY - 20,
          width: 88,
          height: 40,
          borderRadius: "50%",
          border: `3px solid ${COLORS.brand}`,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: jaipurX - 7,
          top: jaipurY - 7,
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: COLORS.brand,
        }}
      />
      {/* The real pin glyph, tip on the coordinate */}
      <Img
        src={staticFile(BRAND.pin)}
        style={{
          position: "absolute",
          left: jaipurX - pinW / 2,
          top: jaipurY - pinH,
          width: pinW,
          height: pinH,
          filter: "drop-shadow(0 14px 26px rgba(0,0,0,0.5))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 1500,
          ...FONTS.mono,
          fontSize: 24,
          letterSpacing: "0.16em",
          color: COLORS.soft,
        }}
      >
        MAP CHECK · NATURAL EARTH VIA DATAMAPS · MERCATOR · JAIPUR 26.9124N 75.7873E
      </div>
    </AbsoluteFill>
  );
};
