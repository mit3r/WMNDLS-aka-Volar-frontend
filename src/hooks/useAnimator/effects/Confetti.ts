import type { Effect } from "../types/effects";

export const ConfettiEffect: Effect = {
  basePeriod: 0.1,

  get: () => {
    return Math.random() < 0.01 ? 1 : 0;
  },
};
