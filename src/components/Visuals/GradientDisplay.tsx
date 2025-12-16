import { animeStore } from "@store/animeStore";
import { uiStore } from "@store/uiStore";
import { motion } from "motion/react";
import { useCallback, useMemo } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/shallow";

export default function GradientDisplay(props: { groupId: number; visualId: number }) {
  const setTab = useStore(uiStore, (state) => state.setTab);
  const handleClick = useCallback(() => setTab("color"), [setTab]);

  const gradient = useStore(
    animeStore,
    useShallow((state) => {
      const group = state.groups.find((g) => g.id === props.groupId);
      if (!group) return undefined;
      const visual = group.visuals.find((v) => v.id === props.visualId);
      if (!visual) return undefined;
      return visual.gradient;
    }),
  );

  const length = useMemo(() => (!gradient || gradient.length <= 1 ? 2 : gradient.length), [gradient]);

  const background = useMemo(
    () =>
      gradient === undefined
        ? "linear-gradient(180deg, #000000 0%, #000000 100%)"
        : `linear-gradient(180deg, ${gradient
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
