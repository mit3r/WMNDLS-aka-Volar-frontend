import type { Effect } from "../types/effects";

export const SolidEffect: Effect = {
  basePeriod: 1,

  get: (): number => {
    return 1;
  },
};
