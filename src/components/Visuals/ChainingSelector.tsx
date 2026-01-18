import ChainIcons from "@assets/ChainIcons.json";
import { ChainingMode } from "@hooks/useAnimator/types/visuals";
import { animeStore } from "@store/animeStore";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/shallow";
import { publicAsset } from "@utils/publicAsset";

export default function ChainingSelector(props: { groupId: number; visualId: number }) {
  const chaining = useStore(
    animeStore,
    useShallow((state) => {
      const group = state.groups.find((g) => g.id === props.groupId);
      if (!group) return undefined;
      const visual = group.visuals.find((v) => v.id === props.visualId);
      if (!visual) return undefined;
      return visual.chaining;
    }),
  );

  const setChainingMode = useStore(animeStore, (state) => state.setVisualChainingMode);

  const moveChaining = useCallback(() => {
    if (chaining === ChainingMode.WHEN_LAST_ENDED) setChainingMode(ChainingMode.WHEN_LAST_STARTED);
    if (chaining === ChainingMode.WHEN_LAST_STARTED) setChainingMode(ChainingMode.WHEN_LAST_ENDED);
  }, [setChainingMode, chaining]);

  const [direction, setDirection] = useState<boolean>(true);
  const block = useRef<boolean>(false);
  const initial = useMemo(() => ({ opacity: 1, x: direction ? 50 : -50, rotate: direction ? 90 : -90 }), [direction]);
  const exit = useMemo(() => ({ opacity: 0, x: direction ? -50 : 50, rotate: direction ? -90 : 90 }), [direction]);

  const handlePrevRepeat = useCallback(() => {
    if (block.current) return;
    block.current = true;

    setDirection(false);
    moveChaining();
  }, [moveChaining, setDirection, block]);

  const handleNextRepeat = useCallback(() => {
    if (block.current) return;
    block.current = true;

    setDirection(true);
    moveChaining();
  }, [moveChaining, setDirection, block]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => (e.shiftKey ? handlePrevRepeat : handleNextRepeat)(),
    [handlePrevRepeat, handleNextRepeat],
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => (e.deltaY > 0 ? handlePrevRepeat() : handleNextRepeat()),
    [handlePrevRepeat, handleNextRepeat],
  );

  return (
    <button
      className="grid grid-cols-1 grid-rows-1 overflow-clip rounded-2xl bg-white"
      onClick={handleClick}
      onWheel={handleWheel}
    >
      <AnimatePresence>
        <motion.div
          onAnimationComplete={() => (block.current = false)}
          transition={{ duration: 0.1 }}
          initial={initial}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={exit}
          key={chaining}
          className="col-start-1 col-end-1 row-start-1 row-end-1 grid w-full origin-bottom place-items-center p-4 font-mono text-2xl font-bold text-black"
        >
          {chaining !== undefined && chaining !== ChainingMode.length && (
            <img className="brightness-25" src={publicAsset(ChainIcons[chaining].src)} />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
