import { CRGB } from "@api/Transmitter";
import type { Effect } from ".";

export const FlashingEffect: Effect = {
  basePeriod: 1,

  requestFrame: (ledOffset: number, inColor: CRGB, timeOffset: number): CRGB => {
    if (ledOffset < timeOffset) return inColor;
    return new CRGB(0, 0, 0);
  },
};
