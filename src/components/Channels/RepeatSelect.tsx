import type { Pc } from "@api/Transmitter";
import { effectStore } from "@store/effectStore";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useStore } from "zustand";

export default function RepeatSelect(props: { channelId: Pc.Channel }) {
  const repeat = useStore(effectStore, (state) => state.effects[props.channelId].repeat);
  const moveRepeat = useStore(effectStore, (state) => state.moveRepeat);
  const [direction, setDirection] = useState<boolean>(true);
  const block = useRef<boolean>(false);
  const initial = useMemo(() => ({ opacity: 1, x: direction ? 50 : -50, rotate: direction ? 90 : -90 }), [direction]);
  const exit = useMemo(() => ({ opacity: 0, x: direction ? -50 : 50, rotate: direction ? -90 : 90 }), [direction]);

  const handlePrevRepeat = useCallback(() => {
    if (block.current) return;
    block.current = true;

    setDirection(false);
    moveRepeat(props.channelId, -1);
  }, [moveRepeat, props.channelId, setDirection, block]);

  const handleNextRepeat = useCallback(() => {
    if (block.current) return;
    block.current = true;

    setDirection(true);
    moveRepeat(props.channelId, 1);
  }, [moveRepeat, props.channelId, setDirection, block]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => (e.shiftKey ? handlePrevRepeat() : handleNextRepeat()),
    [handlePrevRepeat, handleNextRepeat],
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => (e.deltaY > 0 ? handlePrevRepeat() : handleNextRepeat()),
    [handlePrevRepeat, handleNextRepeat],
  );

  return (
    <button
      className="grid aspect-square grid-cols-1 grid-rows-1 overflow-clip rounded-2xl bg-white"
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
          key={repeat}
          className="col-start-1 col-end-1 row-start-1 row-end-1 grid w-full origin-bottom place-items-center p-4 font-mono text-2xl font-bold text-black"
        >
          {repeat}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
