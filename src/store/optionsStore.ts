import { AnimatorOptionsType, defaultAnimatorOptions, type AnimatorOptions } from "@api/Animator";
import { Pc } from "@api/Transmitter";
import { produce } from "immer";
import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OptionsStore {
  options: AnimatorOptions;
  setOptions<T extends AnimatorOptionsType>(name: T, value: AnimatorOptions[T]): void;
}

const OPTIONS_STORE_KEY = "volar:optionsStore";

function normalizeOptions(options: AnimatorOptions): AnimatorOptions {
  const max = Pc.PayloadMaxChannels[options.rgbFormat];
  return {
    ...options,
    multicastChannelsNum: Math.min(max, options.multicastChannelsNum) as AnimatorOptions["multicastChannelsNum"],
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

            // Adjust dependent options
            if (name === AnimatorOptionsType.RGB_FORMAT)
              state.options.multicastChannelsNum = Pc.PayloadMaxChannels[
                value as AnimatorOptions["rgbFormat"]
              ] as AnimatorOptions["multicastChannelsNum"];

            // Ensure multicastChannelsNum does not exceed the max for the selected rgbFormat
            if (name === AnimatorOptionsType.MULTICAST_CHANNELS_NUM)
              state.options.multicastChannelsNum = Math.min(
                Pc.PayloadMaxChannels[state.options.rgbFormat],
                state.options.multicastChannelsNum,
              ) as AnimatorOptions["multicastChannelsNum"];
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
