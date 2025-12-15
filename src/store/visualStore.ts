import { EffectRepeat, EffectType, type EffectConfig } from "@api/Animator/effect";
import type { Gradient } from "@api/Animator/gradient";
import { CRGB, type Pc } from "@api/Transmitter";
import mod from "@utils/mod";
import { produce } from "immer";
import { createStore } from "zustand";

interface VisualStore {
  editableVisualId: number | null;
  visuals: number[];
  channels: Pc.Channel[];
  gradients: Gradient[];
  effects: EffectConfig[];
  progresses: number[][];

  // Channel management
  setChannel: (visualId: number, channelId: Pc.Channel) => void;

  // Visuals management
  setEditableVisualId: (visualId: number | null) => void;
  setVisuals: (visuals: number[]) => void;
  addVisual: () => void;
  removeVisual: (visualId: number) => void;

  // Gradient management
  updateGradientStop: (stopId: number, color: CRGB) => void;
  addGradientStop: () => void;
  removeGradientStop: (stopId: number) => void;
  setGradient: (gradient: Gradient) => void;

  // Effect management
  setEffectType: (effectType: EffectType) => void;
  setEffectRepeat: (repeat: EffectRepeat) => void;
  moveSpeed: (visualId: number, offset: -1 | 1) => void;
  moveRepeat: (visualId: number, offset: -1 | 1) => void;

  // Progress management
  pushProgress: (visualId: number) => void;
  moveProgress: (visualId: number, offset: number) => void;
  resetProgress: (visualId: number) => void;
}

export const visualStore = createStore<VisualStore>((set) => ({
  editableVisualId: null,
  visuals: [0],
  channels: [0],
  gradients: [[{ id: 0, color: new CRGB(0, 0, 0) }]],
  effects: [{ type: EffectType.Solid, speed: 1, repeat: EffectRepeat.NO_REPEAT }],
  progresses: [[0]],

  // Channel management
  setChannel: (visualId, channelId) =>
    set(
      produce((state: VisualStore) => {
        state.channels[visualId] = channelId;
      }),
    ),

  // Visuals management
  setEditableVisualId: (id) => set({ editableVisualId: id }),
  setVisuals: (visuals) =>
    set(
      produce((state: VisualStore) => {
        state.visuals = visuals;

        // Reorder channels, gradients, effects accordingly
        state.channels = visuals.map((v) => state.channels[v] || 0);
        state.gradients = visuals.map((v) => state.gradients[v] || [{ id: 0, color: new CRGB(0, 0, 0) }]);
        state.effects = visuals.map((v) => state.effects[v] || 0);
        state.progresses = visuals.map((v) => state.progresses[v] || [0]);
      }),
    ),
  addVisual: () =>
    set(
      produce((state: VisualStore) => {
        const newId = state.visuals.length > 0 ? Math.max(...state.visuals) + 1 : 0;
        state.visuals.push(newId);
        state.channels.push(0);
        state.gradients.push([{ id: 0, color: new CRGB(0, 0, 0) }]);
        state.effects.push({
          type: EffectType.Solid,
          speed: 1,
          repeat: EffectRepeat.NO_REPEAT,
        });
        state.progresses.push([0]);
      }),
    ),
  removeVisual: (visualId) =>
    set(
      produce((state: VisualStore) => {
        if (state.editableVisualId === visualId) state.editableVisualId = null;
        state.visuals = state.visuals.filter((v) => v !== visualId);
        state.channels.splice(visualId, 1);
        state.gradients.splice(visualId, 1);
        state.effects.splice(visualId, 1);
        state.progresses.splice(visualId, 1);
      }),
    ),

  // Gradient management
  updateGradientStop: (id, color) =>
    set(
      produce((state: VisualStore) => {
        if (state.editableVisualId === null) return state;
        for (let i = 0; i < state.gradients[state.editableVisualId].length; i++) {
          if (state.gradients[state.editableVisualId][i].id === id) {
            state.gradients[state.editableVisualId][i].color = color;
            break;
          }
        }
      }),
    ),
  addGradientStop: () =>
    set(
      produce((state: VisualStore) => {
        if (state.editableVisualId === null) return state;

        const newStopId = Math.max(...state.gradients[state.editableVisualId].map((stop) => stop.id)) + 1;
        state.gradients[state.editableVisualId].push({
          id: newStopId,
          color: new CRGB(0, 0, 0),
        });
      }),
    ),

  removeGradientStop: (id) =>
    set(
      produce((state: VisualStore) => {
        if (state.editableVisualId === null) return state;
        state.gradients[state.editableVisualId] = state.gradients[state.editableVisualId].filter(
          (stop) => stop.id !== id,
        );
      }),
    ),
  setGradient: (gradient) =>
    set(
      produce((state: VisualStore) => {
        if (state.editableVisualId === null) return state;
        state.gradients[state.editableVisualId] = gradient;
      }),
    ),

  setEffectType: (effectType) =>
    set(
      produce((state: VisualStore) => {
        if (state.editableVisualId === null) return state;
        state.progresses[state.editableVisualId] = [0];
        state.effects[state.editableVisualId].type = effectType;
      }),
    ),

  setEffectRepeat: (repeat) =>
    set(
      produce((state: VisualStore) => {
        if (state.editableVisualId === null) return state;
        state.progresses[state.editableVisualId] = [0];
        state.effects[state.editableVisualId].repeat = repeat;
      }),
    ),

  moveSpeed: (id, offset) =>
    set(
      produce((state: VisualStore) => {
        const currentSpeed = state.effects[id].speed;
        const speedOptions: EffectConfig["speed"][] = [0.5, 1, 2, 3, 10];
        const currentIndex = speedOptions.indexOf(currentSpeed);
        const nextIndex = mod(currentIndex + offset, speedOptions.length);
        state.effects[id].speed = speedOptions[nextIndex];
        state.progresses[id] = [0];
      }),
    ),
  moveRepeat: (id, offset) =>
    set(
      produce((state: VisualStore) => {
        const currentRepeat = state.effects[id].repeat;
        const repeatOptions: EffectRepeat[] = [EffectRepeat.NO_REPEAT, EffectRepeat.DO_FOREVER];
        const currentIndex = repeatOptions.indexOf(currentRepeat);
        const nextIndex = mod(currentIndex + offset, repeatOptions.length);

        state.effects[id].repeat = repeatOptions[nextIndex];
        state.progresses[id] = [0];
      }),
    ),

  // Progress management
  pushProgress: (visualId: number) =>
    set(
      produce((state: VisualStore) => {
        state.progresses[visualId].push(0);
      }),
    ),

  moveProgress: (visualId: number, offset: number) =>
    set(
      produce((state: VisualStore) => {
        if (state.effects[visualId].repeat === EffectRepeat.DO_FOREVER)
          state.progresses[visualId][0] = mod(state.progresses[visualId][0] + offset, 1);

        for (let i = 1; i < state.progresses[visualId].length; i++)
          state.progresses[visualId][i] = state.progresses[visualId][i] + offset;

        state.progresses[visualId] = state.progresses[visualId].filter((p, i) => i === 0 || p < 1);
      }),
    ),

  resetProgress: (visualId: number) =>
    set(
      produce((state: VisualStore) => {
        state.progresses[visualId] = [0];
      }),
    ),
}));
