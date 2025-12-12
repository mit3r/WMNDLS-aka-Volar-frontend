import { CRGB } from "@api/Transmitter";
import type { Effect } from ".";

export const WaveEffect: Effect = {
  basePeriod: 10,

  requestFrame: (ledOffset: number, inColor: CRGB, timeOffset: number): CRGB => {
    const waveLength = 10; // length of one wave cycle in LED units
    const positionInWave = (ledOffset + timeOffset) % waveLength;
    const brightnessFactor = 0.5 + 0.5 * Math.sin((positionInWave / waveLength) * 2 * Math.PI);
    return new CRGB(inColor.r * brightnessFactor, inColor.g * brightnessFactor, inColor.b * brightnessFactor);
  },
};
