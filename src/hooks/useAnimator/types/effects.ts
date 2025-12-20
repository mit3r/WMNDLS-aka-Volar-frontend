import { CRGB } from "@api/Transmitter";
import { BreathingEffect } from "../effects/Breathing";
import { SolidEffect } from "../effects/Solid";
import { FlashingEffect } from "../effects/Flashing";
import { ShootingEffect } from "../effects/Shooting";
import { ClimbingEffect } from "../effects/Climbing";
import { WaveEffect } from "../effects/Wave";
import { StrobeEffect } from "../effects/Strobe";
import { PulseEffect } from "../effects/Pulse";

export enum EffectType {
  Solid = "Solid", // (solid color)
  Breathing = "Breathing", // (color fades in and out)
  Flashing = "Flashing", // (color fills strip and then goes off)
  Loading = "Loading", // (color fills strip from one end to the other)
  Shooting = "Shooting", // Star (a bright point moves quickly across the strip)
  Tenis = "Tenis", // (color point(s) moves from one end to the other)
  Wave = "Wave", // (color waves along the strip)
  Strobe = "Strobe", // (quick flashes of color)
  Pulse = "Pulse", // (pulses from center outwards)
  Sparkle = "Sparkle", // (random twinkling points of color)
  Confetti = "Confetti", // (random bursts of color)
  Glitter = "Glitter", // (small, bright points of color)
  Twinkle = "Twinkle", // (random flickering points of color)
  Meteor = "Meteor", // (a bright point with a fading tail moves across the strip)
  Lightning = "Lightning", // (simulates lightning flashes)
  Rain = "Rain", // (simulates raindrop effect)
  Fire = "Fire", // (simulates fire effect)
  Music = "Music", // (reacts to music input)
}

export interface Effect {
  basePeriod: number; // in seconds
  requestFrame: (index: number, color: CRGB, offset: number) => CRGB;
}

export const EFFECTS: Record<EffectType, Effect> = {
  [EffectType.Breathing]: BreathingEffect,
  [EffectType.Solid]: SolidEffect,
  [EffectType.Flashing]: FlashingEffect,
  [EffectType.Loading]: ClimbingEffect,
  [EffectType.Shooting]: ShootingEffect,
  [EffectType.Tenis]: { basePeriod: 1, requestFrame: () => new CRGB(0, 0, 0) },
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
