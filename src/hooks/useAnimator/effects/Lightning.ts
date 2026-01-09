import type { Effect } from "../types/effects";

export const LightningEffect: Effect = {
  basePeriod: 0.2,

  get: (_ledOffset: number, timeOffset: number) => {
    // A random chance for a flash at the beginning of the period
    if (timeOffset < 0.1 && Math.random() > 0.95) {
      // Some LEDs in the strip will flash
      return Math.random() > 0.3 ? 1 : 0;
    }
    return 0;
  },
};
