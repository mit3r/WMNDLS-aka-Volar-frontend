import type { Gradient } from "@hooks/useAnimator/gradients";
import { CRGB, type Pc } from "@api/Transmitter";
import { createStore } from "zustand";
import { uiStore } from "./uiStore";
import { produce } from "immer";

interface GradientStore {
  gradients: { [key in Pc.Channel]: Gradient };

  updateGradientStop: (id: number, color: CRGB) => void;
  addGradientStop: () => void;
  removeGradientStop: (id: number) => void;
  setGradient: (gradient: Gradient) => void;
}

const gradientStore = createStore<GradientStore>()((set) => ({
  gradients: {
    0: [{ id: 0, color: new CRGB(0, 0, 0) }],
    1: [{ id: 0, color: new CRGB(0, 0, 0) }],
    2: [{ id: 0, color: new CRGB(0, 0, 0) }],
    3: [{ id: 0, color: new CRGB(0, 0, 0) }],
    255: [{ id: 0, color: new CRGB(0, 0, 0) }],
  },
  updateGradientStop: (id, color) =>
    set(
      produce((state: GradientStore) => {
        const channel = uiStore.getState().editChannel as Pc.Channel;
        if (channel === null) return state;

        state.gradients[channel] = state.gradients[channel].map((stop) => (stop.id === id ? { ...stop, color } : stop));
      }),
    ),
  addGradientStop: () =>
    set(
      produce((state: GradientStore) => {
        const channel = uiStore.getState().editChannel as Pc.Channel;
        if (channel === null) return state;

        const newStopId = Math.max(...state.gradients[channel].map((stop) => stop.id)) + 1;
        state.gradients[channel].push({ id: newStopId, color: new CRGB(0, 0, 0) });
      }),
    ),

  removeGradientStop: (id) =>
    set(
      produce((state: GradientStore) => {
        const channel = uiStore.getState().editChannel as Pc.Channel;
        if (channel === null) return state;

        state.gradients[channel] = state.gradients[channel].filter((stop) => stop.id !== id);
      }),
    ),
  setGradient: (gradient) =>
    set(
      produce((state: GradientStore) => {
        const channel = uiStore.getState().editChannel as Pc.Channel;
        if (channel === null) return state;
        state.gradients[channel] = gradient;
      }),
    ),
}));
