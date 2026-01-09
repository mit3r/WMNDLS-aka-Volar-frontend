import type { Effect } from "../types/effects";

export const GlitterEffect: Effect = {
  basePeriod: 0.1,

  get: () => {
    return Math.random() < 0.1 ? 1 : 0;
  },
};
