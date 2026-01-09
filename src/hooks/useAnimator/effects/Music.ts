import type { Effect } from "../types/effects";

export const MusicEffect: Effect = {
  basePeriod: 60 / 120,

  get: (ledOffset: number, timeOffset: number) => {
    const bassBeat = Math.pow(Math.sin(timeOffset * Math.PI), 4);
    const midBeat = (Math.sin(ledOffset * 10 + timeOffset * 4 * Math.PI) + 1) / 2;
    const trebleBeat = Math.random() < 0.2 ? Math.random() : 0;

    if (ledOffset < 1 / 3) {
      return bassBeat;
    } else if (ledOffset < 2 / 3) {
      return midBeat;
    } else {
      return trebleBeat;
    }
  },
};
