import { animeStore } from "@store/animeStore";
import { uiStore } from "@store/uiStore";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { useStore } from "zustand";

export default function EffectSelect(props: { groupId: number; visualId: number }) {
  const setTab = useStore(uiStore, (state) => state.setTab);
  const setEditableVisualId = useStore(animeStore, (state) => state.setEditableVisualId);
  const effect = useStore(animeStore, (state) => {
    const group = state.groups.find((g) => g.id === props.groupId);
    const visual = group?.visuals.find((v) => v.id === props.visualId);
    return visual?.effect;
  });

  const handleClick = useCallback(() => {
    setEditableVisualId(props.visualId);
    setTab("effect");
  }, [setEditableVisualId, setTab, props.visualId]);

  return (
    <div
      className="grid place-content-center rounded-2xl border-2 border-gray-500 p-2 text-center"
      onClick={handleClick}
    >
      <AnimatePresence>
        <motion.div
          key={effect ?? "no-effect"}
          className="absolute place-self-center"
          initial={{ opacity: 0, scale: 0.0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.0 }}
        >
          {effect == null ? "No Effect" : effect}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
