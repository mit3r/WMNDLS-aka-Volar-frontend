import type { Effect } from "../types/effects";

export const LoadingEffect: Effect = {
  basePeriod: 2,

  get: (ledOffset: number, timeOffset: number) => {
    return ledOffset < timeOffset ? 1 : 0;
  },
};
