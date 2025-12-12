import type { Pc } from "@api/Transmitter";
import { produce } from "immer";
import { createStore } from "zustand";
import { effectStore } from "./effectStore";
import { EffectRepeat } from "@api/Animator/effect";
import mod from "@utils/mod";

interface ProgressStore {
  progresses: Record<Pc.Channel, number[]>;
  pushProgress: (channel: Pc.Channel) => void;
  moveProgress: (channel: Pc.Channel, offset: number) => void;
  resetProgress: (channel: Pc.Channel) => void;
}

export const progressStore = createStore<ProgressStore>((set) => ({
  progresses: {
    0: [0],
    1: [0],
    2: [0],
    3: [0],
    255: [0],
  },

  pushProgress: (channel: Pc.Channel) =>
    set(produce((state: ProgressStore) => {
        state.progresses[channel].push(0);  
    })),

  moveProgress: (channel: Pc.Channel, offset: number) =>
    set(produce((state: ProgressStore) => {
      if (effectStore.getState().configs[channel].repeat === EffectRepeat.DO_FOREVER)  
        state.progresses[channel][0] = mod(state.progresses[channel][0] + offset, 1);
      

      for(let i = 1; i < state.progresses[channel].length; i++) 
        state.progresses[channel][i] = (state.progresses[channel][i] + offset);

      state.progresses[channel] = state.progresses[channel].filter((p, i) => i === 0 || p < 1);
    })),
    

  resetProgress: (channel: Pc.Channel) =>
    set(produce((state: ProgressStore) => { state.progresses[channel] = [0] })),
}));
