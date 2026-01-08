import { AnimatePresence, hover, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import EffectsIcons from "@assets/EffectsIcons/index.json";
import { twMerge } from "tailwind-merge";
import type { EffectType } from "@hooks/useAnimator/types/effects";

export default function EffectCard(props: { disabled?: boolean; effect: EffectType | null; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHover, setHover] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    return hover(ref.current, () => {
      setHover(true);
      return () => setHover(false);
    });
  }, [ref]);

  return (
    <button
      ref={ref}
      onClick={props.onClick}
      className={twMerge(
        "grid aspect-square place-content-center rounded-2xl border-2 bg-white transition-all select-none",
        props.disabled ? "brightness-50" : "active:scale-95",
      )}
      key={props.effect}
    >
      <AnimatePresence mode="popLayout">
        {props.effect !== null ? (
          isHover ? (
            <motion.span
              key={props.effect}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-black"
            >
              {EffectsIcons[props.effect].name}
            </motion.span>
          ) : (
            <motion.img
              key={props.effect}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full w-full brightness-25"
              src={EffectsIcons[props.effect].img}
              alt={EffectsIcons[props.effect].description}
            />
          )
        ) : (
          <motion.span
            key="no-effect"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-gray-500"
          >
            No Effect
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
