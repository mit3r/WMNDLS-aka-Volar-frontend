import type { Effect } from "../types/effects";

export const TwinkleEffect: Effect = {
  basePeriod: 0.5,

  get: () => {
    return Math.random() < 0.1 ? Math.random() : 0;
  },
};
