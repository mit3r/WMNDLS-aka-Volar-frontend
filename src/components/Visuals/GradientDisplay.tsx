import { globalStore } from "@store/globalStore";
import { visualStore } from "@store/visualStore";
import { motion } from "motion/react";
import { useCallback, useMemo } from "react";
import { useStore } from "zustand";

export default function GradientDisplay(props: { visualId: number }) {
  const setTab = useStore(globalStore, (state) => state.setTab);
  const setEditableVisualId = useStore(visualStore, (state) => state.setEditableVisualId);

  const handleClick = useCallback(() => {
    setEditableVisualId(props.visualId);
    setTab("color");
  }, [setEditableVisualId, setTab, props.visualId]);

  const gradient = useStore(visualStore, (state) => state.gradients[props.visualId]);
  const length = useMemo(() => (gradient.length <= 1 ? 2 : gradient.length), [gradient]);

  const background = useMemo(
    () =>
      `linear-gradient(180deg, ${gradient
        .map((stop, i) => `${stop.color.toHexString()} ${((i * 100) / (length - 1)).toFixed(2)}%`)
        .join(", ")})`,
    [gradient, length],
  );

  return (
    <motion.div
      className="h-full w-full rounded-2xl border-2 border-gray-500"
      animate={{ background }}
      onClick={handleClick}
    />
  );
}
