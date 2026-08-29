import { Easing } from "remotion";
import { MOTION } from "../constants";

/** The default easing curve for entrances. */
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** power4.out — used by the character-stagger entrances. */
export const power4Out = Easing.out(Easing.poly(4));

/** Continuous breathing offset in px — keeps a panel alive after its entrance. */
export const breathe = (frame: number, phase = 0): number =>
  Math.sin(((frame + phase) / MOTION.breathePeriod) * Math.PI * 2) *
  MOTION.breathePx;

/** Continuous 0..1 pulse for glows. */
export const pulse = (frame: number, phase = 0): number =>
  0.5 + 0.5 * Math.sin(((frame + phase) / MOTION.breathePeriod) * Math.PI * 2);
