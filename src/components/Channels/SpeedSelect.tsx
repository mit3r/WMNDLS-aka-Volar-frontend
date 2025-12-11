import type { Pc } from "@api/Transmitter";
import { effectStore } from "@store/effectStore";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useStore } from "zustand";

export default function SpeedSelect(props: { channelId: Pc.Channel }) {
  const speed = useStore(effectStore, (state) => state.effects[props.channelId].speed);
  const moveSpeed = useStore(effectStore, (state) => state.moveSpeed);

  const [direction, setDirection] = useState<boolean>(true);
  const block = useRef<boolean>(false);

  const initial = useMemo(() => ({ opacity: 1, x: direction ? 50 : -50, rotate: direction ? 90 : -90 }), [direction]);
  const exit = useMemo(() => ({ opacity: 0, x: direction ? -50 : 50, rotate: direction ? -90 : 90 }), [direction]);

  const handleNextSpeed = useCallback(() => {
    if (block.current) return;
    block.current = true;

    setDirection(true);
    moveSpeed(props.channelId, 1);
  }, [moveSpeed, props.channelId]);

  const handlePrevSpeed = useCallback(() => {
    if (block.current) return;
    block.current = true;

    setDirection(false);
    moveSpeed(props.channelId, -1);
  }, [moveSpeed, props.channelId]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => (e.deltaY > 0 ? handlePrevSpeed() : handleNextSpeed()),
    [handlePrevSpeed, handleNextSpeed],
  );
  const handleClick = useCallback(
    (e: React.MouseEvent) => (e.shiftKey ? handlePrevSpeed() : handleNextSpeed()),
    [handleNextSpeed, handlePrevSpeed],
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
          key={speed}
          className="col-start-1 col-end-1 row-start-1 row-end-1 grid w-full origin-bottom place-items-center p-4 font-mono text-2xl font-bold text-black"
        >
          {speed}x
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
