import { CRGB } from "@api/Transmitter";
import type { Effect } from "../types/effects";

export const ClimbingEffect: Effect = {
  basePeriod: 2,

  requestFrame: (ledOffset: number, inColor: CRGB, timeOffset: number): CRGB => {
    if (ledOffset < 1 - Math.abs(2 * timeOffset - 1)) return inColor;

    return new CRGB(0, 0, 0);
  },
};
