import type { Pc } from "@api/Transmitter";
import { progressStore } from "@store/progressStore";
import { useCallback } from "react";
import { useStore } from "zustand";

export default function PushButton(props: { channelId: Pc.Channel }) {

  const pushProgress = useStore(progressStore, (state) => state.pushProgress);

  const handlePress = useCallback(() => {
    pushProgress(props.channelId);
  }, [pushProgress, props.channelId]);

  return (
    <button className="bg-strips aspect-video w-full rounded-2xl border-2 text-2xl font-extralight tracking-widest uppercase shadow-black transition-all active:scale-95 active:shadow-md" onClick={handlePress}>
      Press
    </button>
  );
}
