import type { Effect } from "../types/effects";
import { star } from "./utils";

export const TenisEffect: Effect = {
  basePeriod: 1,

  get: (_ledOffset: number, timeOffset: number) => {
    const time = 1 - Math.abs(2 * timeOffset - 1);
    return star((_ledOffset - time) * 10 + 1);
  },
};
