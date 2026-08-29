import React from "react";
import { Img, staticFile } from "remotion";
import { BRAND } from "../constants";

// Placement 1: the persistent corner mark, scenes 1–7. 180px wide at
// (96, 272), 55% opacity, beneath the content. A soft navy gradient sits
// behind it so it never fights a busy photo region.
export const CornerMark: React.FC = () => {
  const h = BRAND.cornerWidth * BRAND.logoAspect;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: BRAND.cornerX - 50,
          top: BRAND.cornerY - 44,
          width: BRAND.cornerWidth + 130,
          height: h + 88,
          background:
            "radial-gradient(60% 60% at 45% 50%, rgba(11, 19, 32, 0.6) 0%, transparent 100%)",
        }}
      />
      <Img
        src={staticFile(BRAND.logo)}
        style={{
          position: "absolute",
          left: BRAND.cornerX,
          top: BRAND.cornerY,
          width: BRAND.cornerWidth,
          height: h,
          opacity: BRAND.cornerOpacity,
        }}
      />
    </>
  );
};
