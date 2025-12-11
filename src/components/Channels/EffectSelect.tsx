import type { Pc } from "@api/Transmitter";
import { effectStore } from "@store/effectStore";
import { globalStore } from "@store/globalStore";
import { useCallback } from "react";
import { useStore } from "zustand";

export default function EffectSelect(props: { channelId: Pc.Channel }) {
  const setTab = useStore(globalStore, (state) => state.setTab);
  const setEditChannel = useStore(globalStore, (state) => state.setEditChannel);
  const effect = useStore(effectStore, (state) => state.effects[props.channelId]);

  const handleClick = useCallback(() => {
    setEditChannel(props.channelId);
    setTab("effect");
  }, [setEditChannel, setTab, props.channelId]);

  return (
    <div
      className="grid aspect-square w-1/2 place-content-center rounded-2xl border-2 border-gray-500 p-2 text-center"
      onClick={handleClick}
    >
      {effect == null ? "No Effect" : effect.type}
    </div>
  );
}
