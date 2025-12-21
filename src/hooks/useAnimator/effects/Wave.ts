import type { Effect } from "../types/effects";

export const WaveEffect: Effect = {
  basePeriod: 10,

  get(ledOffset: number, timeOffset: number): number {
    const w1 = 0.3 * Math.sin(60 * ledOffset - 10 * Math.PI * timeOffset);
    const w2 = 0.15 * Math.sin(30 * ledOffset - 10 * Math.PI * timeOffset);
    const w3 = 0.05 * Math.cos(90 * ledOffset - 10 * Math.PI * timeOffset);

    return 0.5 + w1 + w2 + w3;
  },
};
