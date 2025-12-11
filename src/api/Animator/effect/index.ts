import { CRGB } from "@api/Transmitter";
import { BreathingFrameRequest } from "./Breathing";

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
}

type EffectSpeed = 0.5 | 1 | 2 | 3 | 10; // 0.5x, 1x, 2x, 3x, 10x

interface Effect {
  type: EffectType;
  speed: EffectSpeed;
  repeat: EffectRepeat;

  // switchProgress: number; // progress when switching effects
  // lastType: EffectType; // to remember last type when switching
  // lastSpeed: EffectSpeed; // to remember last speed when switching

  // instanceProgresses: number[]; // each effect instance can have its own progress
}

type EffectFrameFunc = (index: number, color: CRGB, offset: number) => CRGB;
const EffectsFrameFunctions: { [key in EffectType]: EffectFrameFunc } = {
  [EffectType.Breathing]: BreathingFrameRequest,
  [EffectType.Solid]: () => new CRGB(0, 0, 0),
  [EffectType.Flashing]: () => new CRGB(0, 0, 0),
  [EffectType.Climbing]: () => new CRGB(0, 0, 0),
  [EffectType.Shooting]: () => new CRGB(0, 0, 0),
  [EffectType.Falling]: () => new CRGB(0, 0, 0),
  [EffectType.Wave]: () => new CRGB(0, 0, 0),
  [EffectType.Strobe]: () => new CRGB(0, 0, 0),
  [EffectType.Pulse]: () => new CRGB(0, 0, 0),
  [EffectType.Sparkle]: () => new CRGB(0, 0, 0),
  [EffectType.Confetti]: () => new CRGB(0, 0, 0),
  [EffectType.Glitter]: () => new CRGB(0, 0, 0),
  [EffectType.Twinkle]: () => new CRGB(0, 0, 0),
  [EffectType.Meteor]: () => new CRGB(0, 0, 0),
  [EffectType.Lightning]: () => new CRGB(0, 0, 0),
  [EffectType.Rain]: () => new CRGB(0, 0, 0),
  [EffectType.Fire]: () => new CRGB(0, 0, 0),
  [EffectType.Music]: () => new CRGB(0, 0, 0),
};

export { type Effect, EffectType, EffectRepeat, type EffectSpeed, EffectsFrameFunctions };
