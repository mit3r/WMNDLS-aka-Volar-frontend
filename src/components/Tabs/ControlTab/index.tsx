import { AnimatorOptionsType, type AnimatorOptions } from "@api/Animator";
import { Pc } from "@api/Transmitter";
import { MessageType } from "@api/Transmitter/Protocol";
import { optionsStore } from "@store/optionsStore";
import { useStore } from "zustand/react";

export default function ControlTab() {
  const options = useStore(optionsStore, (state) => state.options);
  const setOptions = useStore(optionsStore, (state) => state.setOptions);

  return (
    <div className="grid h-fit grid-cols-1 gap-4 text-white">
      {/* Realtime updates */}
      <div className="flex items-center gap-2 bg-gray-700 px-3 py-2">
        <label className="w-full select-none" htmlFor={AnimatorOptionsType.REALTIME_UPDATE}>
          Realtime updates
        </label>
        <input
          id={AnimatorOptionsType.REALTIME_UPDATE}
          type="checkbox"
          checked={options.realtimeUpdate}
          onChange={(e) => setOptions(AnimatorOptionsType.REALTIME_UPDATE, e.target.checked)}
        />
      </div>

      {/* RGB format */}
      <div className="flex items-center gap-2 bg-gray-700 px-3 py-2">
        <label className="w-full select-none" htmlFor={AnimatorOptionsType.RGB_FORMAT}>
          RGB format
        </label>
        <select
          className="rounded-md bg-gray-800 px-3 text-right"
          id={AnimatorOptionsType.RGB_FORMAT}
          value={options.rgbFormat}
          onChange={(e) =>
            setOptions(AnimatorOptionsType.RGB_FORMAT, Number(e.target.value) as AnimatorOptions["rgbFormat"])
          }
        >
          <option value={MessageType.COLORS24}>24 bit</option>
          <option value={MessageType.COLORS16}>16 bit</option>
          <option value={MessageType.COLORS8}>8 bit</option>
        </select>
      </div>

      {/* Broadcast channel */}
      <div className="flex items-center gap-2 bg-gray-700 px-3 py-2">
        <label className="w-full select-none" htmlFor={AnimatorOptionsType.BROADCAST_CHANNEL_ACTIVE}>
          Broadcast channel
        </label>
        <input
          id={AnimatorOptionsType.BROADCAST_CHANNEL_ACTIVE}
          type="checkbox"
          checked={options.broadcastChannelActive}
          onChange={(e) => setOptions(AnimatorOptionsType.BROADCAST_CHANNEL_ACTIVE, e.target.checked)}
        />
      </div>

      {/* Multicast channels */}
      <div className="flex items-center gap-2 bg-gray-700 px-3 py-2">
        <label className="w-full select-none" htmlFor={AnimatorOptionsType.MULTICAST_CHANNELS_NUM}>
          Multicast channels
        </label>
        <input
          id={AnimatorOptionsType.MULTICAST_CHANNELS_NUM}
          type="number"
          min={0}
          max={Pc.PayloadMaxChannels[options["rgbFormat"]]}
          value={options["multicastChannelsNum"]}
          onChange={(e) =>
            setOptions(
              AnimatorOptionsType.MULTICAST_CHANNELS_NUM,
              Number(e.target.value) as AnimatorOptions["multicastChannelsNum"],
            )
          }
        />
      </div>
    </div>
  );
}
