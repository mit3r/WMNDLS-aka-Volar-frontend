import { animeStore } from "@store/animeStore";
import { AnimatePresence, hover, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useStore } from "zustand";
import EffectsIcons from "@assets/EffectsIcons.json";
import { EffectType } from "@hooks/useAnimator/types/effects";

export default function EffectTab() {
  const effect = useStore(animeStore, (state) => {
    const group = state.groups.find((g) => g.id === state.editableGroupId);
    if (!group) return undefined;
    const visual = group.visuals.find((v) => v.id === state.editableVisualId);
    if (!visual) return undefined;
    return visual.effect;
  });

  const setEffectType = useStore(animeStore, (state) => state.setVisualEffect);

  return (
    <div className="grid h-full grid-cols-2 gap-6 overflow-y-auto py-2 pr-4 pl-2">
      {Object.values(EffectType).map((key) => (
        <EffectCard selected={effect === key} effect={key} setEffectType={setEffectType} />
      ))}
    </div>
  );
}

function EffectCard(props: { selected: boolean; effect: EffectType; setEffectType: (effect: EffectType) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHover, setHover] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    return hover(ref.current, () => {
      setHover(true);
      return () => setHover(false);
    });
  }, [ref]);

  const { name, description, img } = EffectsIcons[props.effect];

  return (
    <button
      ref={ref}
      onClick={() => props.setEffectType(props.effect)}
      className={twMerge(
        "grid aspect-square place-content-center rounded-2xl border-2 bg-white transition-all select-none",
        props.selected ? "brightness-50" : "active:scale-95",
      )}
      key={props.effect}
    >
      <AnimatePresence>
        {isHover ? (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-black"
          >
            {name}
          </motion.span>
        ) : (
          <motion.img
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full w-full brightness-25"
            src={img}
            alt={description}
          />
        )}
      </AnimatePresence>
    </button>
  );
}
