import { CRGB } from "@api/Transmitter";
import type { Effect } from ".";

export const StrobeEffect: Effect = {
  basePeriod: 0.1,

  requestFrame: (ledOffset: number, inColor: CRGB, timeOffset: number): CRGB => {
    if (timeOffset < 0.5) return inColor;
    return new CRGB(0, 0, 0);
  },
};
