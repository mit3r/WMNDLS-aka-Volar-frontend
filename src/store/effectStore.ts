// import { EffectRepeat, EffectType, type EffectConfig } from "@api/Animator/effect";
// import type { Pc } from "@api/Transmitter";
// import mod from "@utils/mod";
// import { createStore } from "zustand";
// import { globalStore } from "./globalStore";
// import { progressStore } from "./progressStore";
// import { produce } from "immer";

// interface EffectStore {
//   configs: { [key in Pc.Channel]: EffectConfig };

//   setType: (effectType: EffectType) => void;
//   moveSpeed: (id: Pc.Channel, offset: -1 | 1) => void;
//   moveRepeat: (id: Pc.Channel, offset: -1 | 1) => void;
// }

// const effectStore = createStore<EffectStore>()((set) => ({
//   configs: {
//     0: { type: EffectType.Solid, speed: 1, repeat: 0 },
//     1: { type: EffectType.Solid, speed: 1, repeat: 0 },
//     2: { type: EffectType.Solid, speed: 1, repeat: 0 },
//     3: { type: EffectType.Solid, speed: 1, repeat: 0 },
//     255: { type: EffectType.Solid, speed: 1, repeat: 0 },
//   },

//   setType: (effectType) =>
//     set(produce((state) => {
//       const channel = globalStore.getState().editChannel as Pc.Channel;
//       if (channel === null) return state;
//       progressStore.getState().resetProgress(channel);

//       state.configs[channel].type = effectType;
//     })),
//   moveSpeed: (id, offset) =>
//     set(produce((state: EffectStore) => {
//       const currentSpeed = state.configs[id].speed;
//       const speedOptions: EffectConfig["speed"][] = [0.5, 1, 2, 3, 10];
//       const currentIndex = speedOptions.indexOf(currentSpeed);
//       const nextIndex = mod(currentIndex + offset, speedOptions.length);
//       state.configs[id].speed = speedOptions[nextIndex];
//       progressStore.getState().resetProgress(id);
//     })),
//   moveRepeat: (id, offset) =>
//     set(produce((state: EffectStore) => {
//       const currentRepeat = state.configs[id].repeat;
//       const repeatOptions: EffectRepeat[] = [EffectRepeat.NO_REPEAT, EffectRepeat.DO_FOREVER];
//       const currentIndex = repeatOptions.indexOf(currentRepeat);
//       const nextIndex = mod(currentIndex + offset, repeatOptions.length);

//       state.configs[id].repeat = repeatOptions[nextIndex];
//       progressStore.getState().resetProgress(id);
//     })),
// }));
