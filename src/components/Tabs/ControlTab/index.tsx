import { AnimatorOptionsType, type AnimatorOptions } from "@api/Animator";
import { MessageType } from "@api/Transmitter/Protocol";
import { animeStore } from "@store/animeStore";
import { optionsStore } from "@store/optionsStore";
import { useStore } from "zustand/react";

export default function ControlTab() {
  const options = useStore(optionsStore, (state) => state.options);
  const setOptions = useStore(optionsStore, (state) => state.setOptions);

  const canUndo = useStore(animeStore, (s) => s.canUndo);
  const canRedo = useStore(animeStore, (s) => s.canRedo);
  const undo = useStore(animeStore, (s) => s.undo);
  const redo = useStore(animeStore, (s) => s.redo);

  const resetPage = () => {
    try {
      // Intentionally keep `volar:lastSerialPort` so the app stays on the same COM/port after reset.
      const keys = ["volar:animeStore", "volar:optionsStore", "volar:uiStore"];
      for (const k of keys) localStorage.removeItem(k);
    } catch {
      // ignore
    }
    window.location.reload();
  };

  return (
    <div className="grid h-fit grid-cols-1 gap-4 text-white">
      <div className="flex flex-col gap-2 bg-gray-700 px-3 py-2">
        <span className="select-none">Tools</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-md bg-gray-800 px-2 py-2 text-sm active:scale-95 disabled:opacity-50"
            onClick={undo}
            disabled={!canUndo}
          >
            Undo
          </button>
          <button
            type="button"
            className="rounded-md bg-gray-800 px-2 py-2 text-sm active:scale-95 disabled:opacity-50"
            onClick={redo}
            disabled={!canRedo}
          >
            Redo
          </button>
        </div>
        <button
          type="button"
          className="rounded-md bg-red-700 px-2 py-2 text-sm active:scale-95"
          onClick={resetPage}
        >
          Reset page (clear saved state)
        </button>
        <span className="text-xs text-white/80">
          Reset usuwa zapisany stan (localStorage) i przeładowuje stronę.
        </span>
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
      {/* (removed: presets / realtime updates / multicast channels) */}
    </div>
  );
}
