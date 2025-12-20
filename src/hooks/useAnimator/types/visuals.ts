import type { EffectType } from "./effects";
import type { Gradient } from "./gradients";

export enum ChainingMode {
  WHEN_LAST_STARTED = "when_last_started",
  WHEN_LAST_ENDED = "when_last_ended",
  length = "length",
}

export enum RepeatMode {
  STOP = "stop",
  ONCE = "once",
  FOREVER = "forever",
  length = "length",
}

export interface Visual {
  id: number;

  chaining: ChainingMode;
  delay: number;
  duration: number;

  effect: EffectType;
  gradient: Gradient;
}
