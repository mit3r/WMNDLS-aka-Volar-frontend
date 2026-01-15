import { animeStore } from "@store/animeStore";
import { AnimatePresence, hover, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useStore } from "zustand";
import EffectsIcons from "@assets/EffectsIcons.json";
import { EffectType } from "@hooks/useAnimator/types/effects";
import { useSyncExternalStore } from "react";
import {
  disableMicrophoneAnalyzer,
  enableMicrophoneAnalyzer,
  getMusicAnalyzerError,
  getMusicAnalyzerStatus,
  subscribeMusicAnalyzer,
} from "@hooks/useAnimator/effects/musicAnalyzer";

export default function EffectTab() {
  const effect = useStore(animeStore, (state) => {
    const group = state.groups.find((g) => g.id === state.editableGroupId);
    if (!group) return undefined;
    const visual = group.visuals.find((v) => v.id === state.editableVisualId);
    if (!visual) return undefined;
    return visual.effect;
  });

  const setEffectType = useStore(animeStore, (state) => state.setVisualEffect);

  const micStatus = useSyncExternalStore(subscribeMusicAnalyzer, getMusicAnalyzerStatus);
  const micError = useSyncExternalStore(subscribeMusicAnalyzer, getMusicAnalyzerError);

  return (
    <div className="grid h-full grid-cols-2 gap-6 overflow-y-auto py-2 pr-4 pl-2">
      {effect === EffectType.Music ? (
        <div className="col-span-2 rounded-2xl border-2 border-gray-600 bg-gray-900/40 p-3 text-sm text-white">
          <div className="flex items-center justify-between gap-2">
            <div className="font-medium">Microphone input (FFT)</div>

            {micStatus === "on" ? (
              <button
                className="rounded-lg bg-red-600 px-3 py-1 text-white active:scale-95"
                onClick={() => void disableMicrophoneAnalyzer()}
              >
                Wyłącz
              </button>
            ) : (
              <button
                className="rounded-lg bg-emerald-600 px-3 py-1 text-white active:scale-95"
                onClick={() => void enableMicrophoneAnalyzer()}
                disabled={micStatus === "requesting" || micStatus === "unsupported"}
              >
                {micStatus === "requesting" ? "Proszę czekać…" : "Włącz mikrofon"}
              </button>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-200">
            Status: <span className="font-mono">{micStatus}</span>
            {micError ? <span className="ml-2 text-red-300">({micError})</span> : null}
          </div>
          <div className="mt-1 text-xs text-gray-300">
            Uwaga: przeglądarka może wymagać kliknięcia (user gesture) do uruchomienia AudioContext i zgody na mikrofon.
          </div>
        </div>
      ) : null}

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
