import type { Pc } from "@api/Transmitter";
import mod from "@utils/mod";
import { createStore } from "zustand";
import { globalStore } from "./globalStore";
import { type Effect, EffectRepeat, EffectType } from "@api/Animator/effect";

interface EffectStore {
  effects: { [key in Pc.Channel]: Effect };

  setProgress: (id: Pc.Channel, progress: number) => void;

  setType: (effectType: EffectType) => void;
  moveSpeed: (id: Pc.Channel, offset: -1 | 1) => void;
  moveRepeat: (id: Pc.Channel, offset: -1 | 1) => void;
}

export const effectStore = createStore<EffectStore>()((set) => ({
  effects: {
    0: { type: EffectType.Solid, speed: 1, repeat: 0, progress: 0 },
    1: { type: EffectType.Solid, speed: 1, repeat: 0, progress: 0 },
    2: { type: EffectType.Solid, speed: 1, repeat: 0, progress: 0 },
    3: { type: EffectType.Solid, speed: 1, repeat: 0, progress: 0 },
    255: { type: EffectType.Solid, speed: 1, repeat: 0, progress: 0 },
  },

  setProgress: (id, progress) =>
    set((state) => {
      const updatedEffect = { ...state.effects[id], progress };
      return { ...state, effects: { ...state.effects, [id]: updatedEffect } };
    }),

  setType: (effectType) =>
    set((state) => {
      const channel = globalStore.getState().editChannel as Pc.Channel;
      if (channel === null) return state;

      const updatedEffect = { ...state.effects[channel], type: effectType, progress: 0 };
      return { ...state, effects: { ...state.effects, [channel]: updatedEffect } };
    }),
  moveSpeed: (id, offset) =>
    set((state) => {
      const currentSpeed = state.effects[id].speed;
      const speedOptions: Effect["speed"][] = [0.5, 1, 2, 3, 10];
      const currentIndex = speedOptions.indexOf(currentSpeed);
      const nextIndex = mod(currentIndex + offset, speedOptions.length);
      const updatedEffect = { ...state.effects[id], speed: speedOptions[nextIndex], progress: 0 };
      return { ...state, effects: { ...state.effects, [id]: updatedEffect } };
    }),
  moveRepeat: (id, offset) =>
    set((state) => {
      const currentRepeat = state.effects[id].repeat;
      const repeatOptions: EffectRepeat[] = [EffectRepeat.NO_REPEAT, EffectRepeat.DO_FOREVER];
      const currentIndex = repeatOptions.indexOf(currentRepeat);
      const nextIndex = mod(currentIndex + offset, repeatOptions.length);
      const updatedEffect = { ...state.effects[id], repeat: repeatOptions[nextIndex], progress: 0 };
      return { ...state, effects: { ...state.effects, [id]: updatedEffect } };
    }),
}));
