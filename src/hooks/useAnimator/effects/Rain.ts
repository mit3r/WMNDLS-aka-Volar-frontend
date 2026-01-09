import type { Effect } from "../types/effects";

export const RainEffect: Effect = {
  basePeriod: 0.1,

  get: (ledOffset: number) => {
    return Math.random() < 0.01 ? 1 - ledOffset : 0;
  },
};
