import { CRGB } from "@api/Transmitter";
import type { Effect } from "../types/effects";

export const BreathingEffect: Effect = {
  basePeriod: 5,

  requestFrame: (_ledOffset: number, inColor: CRGB, timeOffset: number): CRGB => {
    const brightness = Math.max(Math.sin(timeOffset * Math.PI) * 0.5, 0);
    return new CRGB(inColor.r * brightness, inColor.g * brightness, inColor.b * brightness);
  },
};
