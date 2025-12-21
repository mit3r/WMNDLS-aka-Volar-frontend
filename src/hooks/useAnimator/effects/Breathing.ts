import type { Effect } from "../types/effects";

export const BreathingEffect: Effect = {
  basePeriod: 5,

  get: (_ledOffset: number, timeOffset: number): number => {
    return Math.max(Math.sin(timeOffset * Math.PI) * 0.5, 0);
  },
};
