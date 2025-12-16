import { animeStore } from "@store/animeStore";
import { useCallback } from "react";
import { useStore } from "zustand";

export default function RemoveButton(props: { groupId: number; visualId: number }) {
  const removeVisual = useStore(animeStore, (state) => state.removeVisual);

  const handleClick = useCallback(() => {
    removeVisual(props.groupId, props.visualId);
  }, [removeVisual, props.groupId, props.visualId]);

  return (
    <button
      className="rounded-2xl border-2 p-1 text-2xl font-extralight tracking-widest transition-all active:scale-95 active:shadow-md"
      onClick={handleClick}
    >
      X
    </button>
  );
}
