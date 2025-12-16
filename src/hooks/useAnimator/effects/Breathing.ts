import { CRGB } from "@api/Transmitter";
import { EffectClass } from ".";

export class BreathingEffect implements EffectClass {
  static basePeriod: number = 5;

  static requestFrame = (_ledOffset: number, inColor: CRGB, timeOffset: number): CRGB => {
    const brightness = Math.max(Math.sin(timeOffset * 4 * Math.PI) * 0.5, 0);
    return new CRGB(inColor.r * brightness, inColor.g * brightness, inColor.b * brightness);
  };
}
