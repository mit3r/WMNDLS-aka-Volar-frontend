import { BreathingEffect } from "../effects/Breathing";
import { ConfettiEffect } from "../effects/Confetti";
import { FireEffect } from "../effects/Fire";
import { FlashingEffect } from "../effects/Flashing";
import { GlitterEffect } from "../effects/Glitter";
import { LightningEffect } from "../effects/Lightning";
import { LoadingEffect } from "../effects/Loading";
import { MeteorEffect } from "../effects/Meteor";
import { MusicEffect } from "../effects/Music";
import { PulseEffect } from "../effects/Pulse";
import { RainEffect } from "../effects/Rain";
import { ShootingEffect } from "../effects/Shooting";
import { SolidEffect } from "../effects/Solid";
import { SparkleEffect } from "../effects/Sparkle";
import { StrobeEffect } from "../effects/Strobe";
import { TenisEffect } from "../effects/Tenis";
import { TwinkleEffect } from "../effects/Twinkle";
import { WaveEffect } from "../effects/Wave";

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
  get: (index: number, offset: number) => number;
}

export const EFFECTS: Record<EffectType, Effect> = {
  [EffectType.Breathing]: BreathingEffect,
  [EffectType.Solid]: SolidEffect,
  [EffectType.Flashing]: FlashingEffect,
  [EffectType.Loading]: LoadingEffect,
  [EffectType.Shooting]: ShootingEffect,
  [EffectType.Tenis]: TenisEffect,
  [EffectType.Wave]: WaveEffect,
  [EffectType.Strobe]: StrobeEffect,
  [EffectType.Pulse]: PulseEffect, // TODO
  [EffectType.Sparkle]: SparkleEffect,
  [EffectType.Confetti]: ConfettiEffect,
  [EffectType.Glitter]: GlitterEffect,
  [EffectType.Twinkle]: TwinkleEffect,
  [EffectType.Meteor]: MeteorEffect,
  [EffectType.Lightning]: LightningEffect,
  [EffectType.Rain]: RainEffect,
  [EffectType.Fire]: FireEffect,
  [EffectType.Music]: MusicEffect,
};
