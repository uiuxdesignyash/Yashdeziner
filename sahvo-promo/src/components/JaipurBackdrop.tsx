import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../constants";

// Code-built blue-hour Jaipur facade — the honest interim layer that stands
// in while a real photograph is missing (PHOTOS[...].src === null).
// A Hawa-Mahal-inspired pyramid of cusped jharokha arches in the three
// background tones, a few windows faintly lit in soft blue. Not fake stock:
// a motion graphic in the brand palette.

const ARCH_W = 72;
const ARCH_H = 150;

const Arch: React.FC<{ x: number; y: number; lit?: boolean; tone: string }> = ({
  x,
  y,
  lit,
  tone,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    <path
      d={`M4 ${ARCH_H} V56 Q4 22 ${ARCH_W / 2 - 12} 16 Q${ARCH_W / 2} -6 ${
        ARCH_W / 2 + 12
      } 16 Q${ARCH_W - 4} 22 ${ARCH_W - 4} 56 V${ARCH_H} Z`}
      fill={tone}
    />
    {lit ? (
      <path
        d={`M16 ${ARCH_H} V60 Q16 36 ${ARCH_W / 2 - 8} 30 Q${ARCH_W / 2} 16 ${
          ARCH_W / 2 + 8
        } 30 Q${ARCH_W - 16} 36 ${ARCH_W - 16} 60 V${ARCH_H} Z`}
        fill={COLORS.soft}
        opacity={0.14}
      />
    ) : null}
  </g>
);

// Deterministic "which windows glow" pattern.
const isLit = (row: number, col: number) => (row * 7 + col * 5) % 11 === 3;

export const JaipurBackdrop: React.FC = () => {
  // Tier rows narrow as they rise — the Hawa Mahal pyramid.
  const tiers = [
    { y: 1720, cols: 15, tone: COLORS.raised },
    { y: 1540, cols: 15, tone: COLORS.surface },
    { y: 1360, cols: 11, tone: COLORS.raised },
    { y: 1180, cols: 9, tone: COLORS.surface },
    { y: 1000, cols: 5, tone: COLORS.raised },
  ];

  return (
    <AbsoluteFill>
      {/* Blue-hour sky */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${COLORS.surface} 0%, ${COLORS.canvas} 55%)`,
        }}
      />
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1920"
        preserveAspectRatio="xMidYMax slice"
        style={{ position: "absolute", inset: 0 }}
      >
        {tiers.map((tier, row) => {
          const totalW = tier.cols * (ARCH_W + 14) - 14;
          const x0 = (1080 - totalW) / 2;
          return (
            <g key={tier.y}>
              {/* Tier slab behind the arches */}
              <rect
                x={x0 - 26}
                y={tier.y - 24}
                width={totalW + 52}
                height={ARCH_H + 60}
                fill={row % 2 === 0 ? COLORS.canvas : COLORS.surface}
                opacity={0.9}
              />
              {Array.from({ length: tier.cols }).map((_, col) => (
                <Arch
                  key={col}
                  x={x0 + col * (ARCH_W + 14)}
                  y={tier.y}
                  tone={tier.tone}
                  lit={isLit(row, col)}
                />
              ))}
            </g>
          );
        })}
        {/* Street silhouette band at the foot */}
        <rect x={0} y={1856} width={1080} height={64} fill={COLORS.canvas} />
      </svg>
    </AbsoluteFill>
  );
};
