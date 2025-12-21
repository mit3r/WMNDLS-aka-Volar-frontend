import type { Effect } from "../types/effects";

export const StrobeEffect: Effect = {
  basePeriod: 0.1,

  get: (_ledOffset: number, timeOffset: number): number => {
    return timeOffset < 0.5 ? 1 : 0;
  },
};
