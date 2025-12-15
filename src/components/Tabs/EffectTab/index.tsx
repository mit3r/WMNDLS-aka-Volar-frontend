import { EffectType } from "@api/Animator/effect";
import { visualStore } from "@store/visualStore";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useStore } from "zustand";

export default function EffectTab() {  
  const editEffect = useStore(visualStore, (state) => state.editableVisualId ? state.effects[state.editableVisualId] : null);
  const setEffectType = useStore(visualStore, (state) => state.setEffectType);

  return (
    <div className="grid h-full grid-cols-3 gap-6 overflow-y-auto py-2 pr-4 pl-2">
      {Object.values(EffectType)
        .filter((value) => isNaN(value as number))
        .map((key) => (
          <button
            onClick={() => setEffectType(EffectType[key as keyof typeof EffectType])}
            className={twMerge(
              clsx("grid aspect-square place-content-center rounded-2xl border-2 bg-white transition-all select-none", {
                "brightness-50": editEffect?.type === key,
                "hover:scale-105 active:scale-95": editEffect?.type !== key,
              }),
            )}
            key={key}
          >
            {key}
          </button>
        ))}
    </div>
  );
}
