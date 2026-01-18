import type { Effect } from "../types/effects";
import { getMusicAnalyzerStatus, getMusicSpectrumValue } from "./musicAnalyzer";

export const MusicEffect: Effect = {
  basePeriod: 60 / 120,

  get: (ledOffset: number, timeOffset: number) => {
    void timeOffset;
    if (getMusicAnalyzerStatus() === "on") return getMusicSpectrumValue(ledOffset);

    // Until microphone is enabled, behave like a static/solid multiplier.
    return 1;
  },
};
