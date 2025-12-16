import type { EffectType } from "../effects";
import type { Gradient } from "../gradients";

export enum ChainingMode {
  WHEN_LAST_STARTED,
  WHEN_LAST_ENDED,
  length,
}

export enum RepeatMode {
  OFF,
  FOREVER,
  length,
}

export interface Visual {
  id: number;

  chaining: ChainingMode;
  start: number;
  duration: number;

  effect: EffectType;
  gradient: Gradient;
}
