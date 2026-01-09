import type { Effect } from "../types/effects";
import { star } from "./utils";

export const MeteorEffect: Effect = {
  basePeriod: 2,

  get: (ledOffset: number, timeOffset: number) => {
    const head = star((ledOffset - timeOffset) * 20);
    // Create a tail that fades out behind the head
    const tail = Math.max(0, (1 - Math.abs(ledOffset - timeOffset) * 5) * 0.5);
    return Math.max(head, ledOffset < timeOffset ? tail : 0);
  },
};
