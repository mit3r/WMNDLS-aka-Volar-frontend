import type { Effect } from "../types/effects";

export const FireEffect: Effect = {
  basePeriod: 0.1,

  get: (ledOffset: number) => {
    // Simulate flickering by using random brightness
    const flicker = Math.random() * 0.4 + 0.6; // Flicker between 60% and 100%
    // The fire is hotter (brighter) at the bottom (ledOffset = 0)
    return (1 - ledOffset) * flicker;
  },
};
