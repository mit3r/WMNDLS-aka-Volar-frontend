import type { Effect } from "../types/effects";

function pulse(x: number, a: number): number {
  if (x < -a || x > a) return 0;
  return Math.cos(((x - 0.5) * Math.PI) / a / 10);
}

export const PulseEffect: Effect = {
  basePeriod: 5,

  get: (ledOffset: number, timeOffset: number): number => {
    return pulse(ledOffset, timeOffset);
  },
};
