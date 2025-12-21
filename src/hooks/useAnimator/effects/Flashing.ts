import type { Effect } from "../types/effects";

export const FlashingEffect: Effect = {
  basePeriod: 1,

  get: (ledOffset: number, timeOffset: number): number => {
    return ledOffset < timeOffset ? 1 : 0;
  },
};
