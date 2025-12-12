import { AnimatorOptionsType, defaultAnimatorOptions, type AnimatorOptions } from "@api/Animator";
import { Pc } from "@api/Transmitter";
import { produce } from "immer";
import { createStore } from "zustand";

interface OptionsStore {
  options: AnimatorOptions;
  setOptions<T extends AnimatorOptionsType>(name: T, value: AnimatorOptions[T]): void;
}

export const optionsStore = createStore<OptionsStore>()((set) => ({
  options: defaultAnimatorOptions,
  setOptions: (name, value) =>
    set(produce((state: OptionsStore) => {
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

    })),
}));
