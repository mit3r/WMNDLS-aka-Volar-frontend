import type { CRGB } from "@api/Transmitter";
import type { EffectFrameFunc } from ".";

export const BreathingFrameRequest: EffectFrameFunc = (_index: number, color: CRGB, offset: number): CRGB => {
  const cut = 0.1;
  const amp = 1 + cut;

  const brightness = Math.max(Math.sin(offset * 2 * Math.PI) * 0.5 * amp - cut, 0);
  color.red *= brightness;
  color.green *= brightness;
  color.blue *= brightness;
  return color;
};
