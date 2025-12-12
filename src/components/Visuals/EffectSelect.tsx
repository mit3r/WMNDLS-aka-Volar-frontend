import { globalStore } from "@store/globalStore";
import { visualStore } from "@store/visualStore";
import { useCallback } from "react";
import { useStore } from "zustand";

export default function EffectSelect(props: { visualId: number }) {
  const setTab = useStore(globalStore, (state) => state.setTab);
  const setEditableVisualId = useStore(visualStore, (state) => state.setEditableVisualId);
  const effect = useStore(visualStore, (state) => state.visuals[props.visualId].effect);

  const handleClick = useCallback(() => {
    setEditableVisualId(props.visualId);
    setTab("effect");
  }, [setEditableVisualId, setTab, props.visualId]);

  return (
    <div
      className="grid aspect-square place-content-center rounded-2xl border-2 border-gray-500 p-2 text-center"
      onClick={handleClick}
    >
      {effect == null ? "No Effect" : effect.type}
    </div>
  );
}
