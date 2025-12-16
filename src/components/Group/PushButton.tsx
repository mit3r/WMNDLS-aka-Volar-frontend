import { animeStore } from "@store/animeStore";
import { useCallback } from "react";
import { useStore } from "zustand";

export default function PlayButton(props: { groupId: number }) {
  const play = useStore(animeStore, (state) => state.startGroupTimer);

  const handlePress = useCallback(() => {
    play(props.groupId);
  }, [play, props.groupId]);

  return (
    <button
      className="bg-strips aspect-[3] w-full rounded-2xl border-2 text-2xl font-extralight tracking-widest uppercase shadow-black transition-all active:scale-95 active:shadow-md"
      onClick={handlePress}
    >
      Play
    </button>
  );
}
