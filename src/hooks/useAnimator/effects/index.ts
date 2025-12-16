import { CRGB } from "@api/Transmitter";
import { BreathingEffect } from "./Breathing";
import { SolidEffect } from "./Solid";
import { FlashingEffect } from "./Flashing";
import { ShootingEffect } from "./Shooting";
import { ClimbingEffect } from "./Climbing";
import { WaveEffect } from "./Wave";
import { StrobeEffect } from "./Strobe";
import { PulseEffect } from "./Pulse";

export enum EffectType {
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

export class EffectClass {
  static basePeriod: number = 1; // in seconds
  static requestFrame: (index: number, color: CRGB, offset: number) => CRGB = () => new CRGB(0, 0, 0);
}

export const effectsInstances: Record<EffectType, EffectClass> = {
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
