import type { Effect } from "../types/effects";

export const ClimbingEffect: Effect = {
  basePeriod: 2,

  get: (ledOffset: number, timeOffset: number): number => {
    return ledOffset < 1 - Math.abs(2 * timeOffset - 1) ? 1 : 0;
  },
};
