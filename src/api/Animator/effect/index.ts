import { CRGB } from "@api/Transmitter";
import { BreathingEffect } from "./Breathing";
import { SolidEffect } from "./Solid";
import { FlashingEffect } from "./Flashing";
import { ShootingEffect } from "./Shooting";
import { ClimbingEffect } from "./Climbing";
import { WaveEffect } from "./Wave";
import { StrobeEffect } from "./Strobe";
import { PulseEffect } from "./Pulse";

enum EffectType {
  Solid, // (solid color)
  Breathing, // (color fades in and out)
  Flashing, // (color fills strip and then goes off)
  Climbing, // (color fills strip from one end to the other)
  Shooting, // Star (a bright point moves quickly across the strip)
  Falling, // (color point(s) moves from one end to the other)
  Wave, // (color waves along the strip)
  Strobe, // (quick flashes of color)
  Pulse, // (pulses from center outwards)
  Sparkle, // (random twinkling points of color)
  Confetti, // (random bursts of color)
  Glitter, // (small, bright points of color)
  Twinkle, // (random flickering points of color)
  Meteor, // (a bright point with a fading tail moves across the strip)
  Lightning, // (simulates lightning flashes)
  Rain, // (simulates raindrop effect)
  Fire, // (simulates fire effect)
  Music, // (reacts to music input)
}

enum EffectRepeat {
  NO_REPEAT, // play only on push
  DO_FOREVER, // loop until stopped
  RUN_ONCE, // play once then stop
}

type EffectSpeed = 0.5 | 1 | 2 | 3 | 10; // 0.5x, 1x, 2x, 3x, 10x

interface EffectConfig {
  type: EffectType;
  speed: EffectSpeed;
  repeat: EffectRepeat;

  // switchProgress: number; // progress when switching effects
  // lastType: EffectType; // to remember last type when switching
  // lastSpeed: EffectSpeed; // to remember last speed when switching
}

interface Effect {
  basePeriod: number; // in seconds
  requestFrame: (index: number, color: CRGB, offset: number) => CRGB;
}

const effectsInstances: Record<EffectType, Effect> = {
  [EffectType.Breathing]: BreathingEffect,
  [EffectType.Solid]: SolidEffect,
  [EffectType.Flashing]: FlashingEffect,
  [EffectType.Climbing]: ClimbingEffect,
  [EffectType.Shooting]: ShootingEffect,
  [EffectType.Falling]: { basePeriod: 1, requestFrame: () => new CRGB(0, 0, 0) },
  [EffectType.Wave]: WaveEffect, // TODO
  [EffectType.Strobe]: StrobeEffect,
  [EffectType.Pulse]: PulseEffect,
  [EffectType.Sparkle]: { basePeriod: 1, requestFrame: () => new CRGB(0, 0, 0) },
  [EffectType.Confetti]: { basePeriod: 1, requestFrame: () => new CRGB(0, 0, 0) },
  [EffectType.Glitter]: { basePeriod: 1, requestFrame: () => new CRGB(0, 0, 0) },
  [EffectType.Twinkle]: { basePeriod: 1, requestFrame: () => new CRGB(0, 0, 0) },
  [EffectType.Meteor]: { basePeriod: 1, requestFrame: () => new CRGB(0, 0, 0) },
  [EffectType.Lightning]: { basePeriod: 1, requestFrame: () => new CRGB(0, 0, 0) },
  [EffectType.Rain]: { basePeriod: 1, requestFrame: () => new CRGB(0, 0, 0) },
  [EffectType.Fire]: { basePeriod: 1, requestFrame: () => new CRGB(0, 0, 0) },
  [EffectType.Music]: { basePeriod: 1, requestFrame: () => new CRGB(0, 0, 0) },
};

export type { Effect, EffectConfig, EffectSpeed };
export { EffectType, EffectRepeat, effectsInstances };

