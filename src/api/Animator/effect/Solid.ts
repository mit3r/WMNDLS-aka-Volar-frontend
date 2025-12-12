import { CRGB } from "@api/Transmitter";
import type { Effect } from ".";

export const SolidEffect: Effect = {
  basePeriod: 0,

  requestFrame: (_ledOffset: number, inColor: CRGB): CRGB => {
    return inColor;
  },
};
