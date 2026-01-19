import { AnimatorOptionsType, defaultAnimatorOptions, type AnimatorOptions } from "@api/Animator";
import { produce } from "immer";
import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OptionsStore {
  options: AnimatorOptions;
  setOptions<T extends AnimatorOptionsType>(name: T, value: AnimatorOptions[T]): void;
}

const OPTIONS_STORE_KEY = "volar:optionsStore";

function normalizeOptions(options: unknown): AnimatorOptions {
  const obj = (options ?? {}) as Partial<Record<string, unknown>>;
  return {
    [AnimatorOptionsType.BROADCAST_CHANNEL_ACTIVE]:
      typeof obj[AnimatorOptionsType.BROADCAST_CHANNEL_ACTIVE] === "boolean"
        ? (obj[AnimatorOptionsType.BROADCAST_CHANNEL_ACTIVE] as boolean)
        : defaultAnimatorOptions.broadcastChannelActive,
    [AnimatorOptionsType.RGB_FORMAT]:
      typeof obj[AnimatorOptionsType.RGB_FORMAT] === "number"
        ? (obj[AnimatorOptionsType.RGB_FORMAT] as AnimatorOptions["rgbFormat"])
        : defaultAnimatorOptions.rgbFormat,
  };
}

export const optionsStore = createStore<OptionsStore>()(
  persist(
    (set) => ({
      options: defaultAnimatorOptions,
      setOptions: (name, value) =>
        set(
          produce((state: OptionsStore) => {
            state.options[name] = value;
          }),
        ),
    }),
    {
      name: OPTIONS_STORE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ options: state.options }),
      merge: (persisted, current) => {
        const persistedState = (persisted as Partial<OptionsStore>) ?? {};
        const options = normalizeOptions(persistedState.options ?? current.options);
        return { ...current, ...persistedState, options } as OptionsStore;
      },
    },
  ),
);
