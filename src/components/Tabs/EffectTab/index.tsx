import { EffectType } from "@hooks/useAnimator/effects";
import { animeStore } from "@store/animeStore";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useStore } from "zustand";

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
    <div className="grid h-full grid-cols-3 gap-6 overflow-y-auto py-2 pr-4 pl-2">
      {Object.values(EffectType)
        .filter((value) => isNaN(value as number))
        .map((key) => (
          <button
            onClick={() => setEffectType(EffectType[key as keyof typeof EffectType])}
            className={twMerge(
              clsx("grid aspect-square place-content-center rounded-2xl border-2 bg-white transition-all select-none", {
                "brightness-50": effect === key,
                "hover:scale-105 active:scale-95": effect !== key,
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
