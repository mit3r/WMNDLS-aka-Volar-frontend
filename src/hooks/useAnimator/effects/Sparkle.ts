import type { Effect } from "../types/effects";

export const SparkleEffect: Effect = {
  basePeriod: 0.2,

  get: () => {
    if (Math.random() < 0.05) {
      return Math.random();
    }
    return 0;
  },
};
