import { EffectRepeat, type EffectConfig, type EffectType } from "@api/Animator/effect";
import type { Gradient } from "@api/Animator/gradient";
import { CRGB, type Pc } from "@api/Transmitter";
import mod from "@utils/mod";
import { produce } from "immer";
import { createStore } from "zustand";


export interface Visual {
  id: number;
  channelId: Pc.Channel;
  gradient: Gradient;
  progresses: number[];
  effect: EffectConfig;
}

interface VisualStore {
  editableVisualId: number | null;
  visuals: Visual[]

  // Channel management
  setChannel: (visualId: number, channelId: Pc.Channel) => void;

  // Visuals management
  setEditableVisualId: (id: number | null) => void;
  setVisuals: (visuals: Visual[]) => void;
  addVisual: () => void;
  removeVisual: (id: number) => void;
  
  // Gradient management
  updateGradientStop: (stopId: number, color: CRGB) => void;
  addGradientStop: () => void;
  removeGradientStop: (stopId: number) => void;
  setGradient: (gradient: Gradient) => void;

  // Effect management
  setEffectType: (effectType: EffectType) => void;
  moveSpeed: (visualId: number, offset: -1 | 1) => void;
  moveRepeat: (visualId: number, offset: -1 | 1) => void;

  // Progress management
  pushProgress: (visualId: number) => void;
  moveProgress: (visualId: number, offset: number) => void;
  resetProgress: (visualId: number) => void;
}

export const visualStore = createStore<VisualStore>((set) => ({
  editableVisualId: null,
  visuals: [{
    id: 0, channelId: 0, gradient: [{id: 0, color: new CRGB(0, 0, 0)}], progresses: [0], effect: { type: 0, speed: 1, repeat: 0 }
  }],

  // Channel management
  setChannel: (visualId, channelId) =>
    set(produce((state: VisualStore) => {
      state.visuals[visualId].channelId = channelId;
    })),

  // Visuals management
  setEditableVisualId: (id) => set({ editableVisualId: id }),
  setVisuals: (visuals) =>
    set((produce((state: VisualStore) => {
      state.visuals = visuals;
    }))),
  addVisual: () =>
    set((produce((state: VisualStore) => {
      const newId = state.visuals.length > 0 ? Math.max(...state.visuals.map((v) => v.id)) + 1 : 0;
      state.visuals.push({ id: newId, channelId: 0, gradient: [{id: 0, color: new CRGB(0, 0, 0)}], progresses: [0], effect: { type: 0, speed: 1, repeat: 0 } });
    }))),
  removeVisual: (id) =>
    set((produce((state: VisualStore) => {
      state.visuals = state.visuals.filter((v) => v.id !== id);
      if (state.editableVisualId === id) state.editableVisualId = null;
    }))),

  // Gradient management
    updateGradientStop: (id, color) =>
        set(produce((state: VisualStore) => {
          if(state.editableVisualId === null) return state;
          for (let i = 0; i < state.visuals[state.editableVisualId].gradient.length; i++) {
            if (state.visuals[state.editableVisualId].gradient[i].id === id) {
              state.visuals[state.editableVisualId].gradient[i].color = color;
              break;
            }
          }
        })),
      addGradientStop: () =>
        set(produce((state: VisualStore) => {
          if(state.editableVisualId === null) return state;
    
          const newStopId = Math.max(...state.visuals[state.editableVisualId].gradient.map((stop) => stop.id)) + 1;
          state.visuals[state.editableVisualId].gradient.push({ id: newStopId, color: new CRGB(0, 0, 0) })
        })),
    
      removeGradientStop: (id) =>
        set(produce((state: VisualStore) => {
          if(state.editableVisualId === null) return state;
          state.visuals[state.editableVisualId].gradient = state.visuals[state.editableVisualId].gradient.filter((stop) => stop.id !== id)
        })),
      setGradient: (gradient) =>
        set(produce((state: VisualStore) => {
          if(state.editableVisualId === null) return state;
          state.visuals[state.editableVisualId].gradient = gradient;
        })),
      
       setEffectType: ( effectType) =>
    set(produce((state: VisualStore) => {
      if(state.editableVisualId === null) return state;
      state.visuals[state.editableVisualId].progresses = [0];
      state.visuals[state.editableVisualId].effect.type = effectType;
    })),
  moveSpeed: (id, offset) =>
    set(produce((state: VisualStore) => {
      const currentSpeed = state.visuals[id].effect.speed;
      const speedOptions: EffectConfig["speed"][] = [0.5, 1, 2, 3, 10];
      const currentIndex = speedOptions.indexOf(currentSpeed);
      const nextIndex = mod(currentIndex + offset, speedOptions.length);
      state.visuals[id].effect.speed = speedOptions[nextIndex];
      state.visuals[id].progresses = [0];
    })),
  moveRepeat: (id, offset) =>
    set(produce((state: VisualStore) => {
      const currentRepeat = state.visuals[id].effect.repeat;
      const repeatOptions: EffectRepeat[] = [EffectRepeat.NO_REPEAT, EffectRepeat.DO_FOREVER];
      const currentIndex = repeatOptions.indexOf(currentRepeat);
      const nextIndex = mod(currentIndex + offset, repeatOptions.length);

      state.visuals[id].effect.repeat = repeatOptions[nextIndex];
      state.visuals[id].progresses = [0];
    })),
    
  // Progress management
  pushProgress: (visualId: number) =>
      set(produce((state: VisualStore) => {
          state.visuals[visualId].progresses.push(0);  
      })),
  
    moveProgress: (visualId: number, offset: number) =>
      set(produce((state: VisualStore) => {
        
        if (state.visuals[visualId].effect.repeat === EffectRepeat.DO_FOREVER)  
          state.visuals[visualId].progresses[0] = mod(state.visuals[visualId].progresses[0] + offset, 1);
        
  
        for(let i = 1; i < state.visuals[visualId].progresses.length; i++) 
          state.visuals[visualId].progresses[i] = (state.visuals[visualId].progresses[i] + offset);
  
        state.visuals[visualId].progresses = state.visuals[visualId].progresses.filter((p, i) => i === 0 || p < 1);
      })),
      
    resetProgress: (visualId: number) =>
      set(produce((state: VisualStore) => { state.visuals[visualId].progresses = [0] })),
}));