import { AnimatorOptionsType, defaultAnimatorOptions, type AnimatorOptions } from "@api/Animator";
import { Pc } from "@api/Transmitter";
import { createStore } from "zustand";

interface OptionsStore {
  options: AnimatorOptions;
  setOptions<T extends AnimatorOptionsType>(name: T, value: AnimatorOptions[T]): void;
}

export const optionsStore = createStore<OptionsStore>()((set) => ({
  options: defaultAnimatorOptions,
  setOptions: (name, value) =>
    set((state) => {
      const newState = { options: { ...state.options, [name]: value } };

      // Adjust dependent options
      if (name === AnimatorOptionsType.RGB_FORMAT)
        newState.options.multicastChannelsNum = Pc.PayloadMaxChannels[
          value as AnimatorOptions["rgbFormat"]
        ] as AnimatorOptions["multicastChannelsNum"];

      // Ensure multicastChannelsNum does not exceed the max for the selected rgbFormat
      if (name === AnimatorOptionsType.MULTICAST_CHANNELS_NUM)
        newState.options.multicastChannelsNum = Math.min(
          Pc.PayloadMaxChannels[newState.options.rgbFormat],
          newState.options.multicastChannelsNum,
        ) as AnimatorOptions["multicastChannelsNum"];

      return newState;
    }),
}));
