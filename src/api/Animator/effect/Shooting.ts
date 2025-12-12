import { CRGB } from "@api/Transmitter";
import type { Effect } from ".";

function star(x: number) {
  if (x < 0 || x > 1) return 0;
  return (x * Math.sin(Math.PI * x)) / 0.57923;
}

export const ShootingEffect: Effect = {
  basePeriod: 1,

  requestFrame: (_ledOffset: number, inColor: CRGB, timeOffset: number): CRGB => {
    const brightness = star((_ledOffset - timeOffset) * 10 + 1);

    return new CRGB(inColor.r * brightness, inColor.g * brightness, inColor.b * brightness);
  },
};
