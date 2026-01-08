import RepeatIcons from "@assets/RepeatIcons.json";
import { RepeatMode } from "@hooks/useAnimator/types/visuals";
import { animeStore } from "@store/animeStore";
import clsx from "clsx";
import { animate } from "motion";
import { motion, useMotionValue } from "motion/react";
import { twMerge } from "tailwind-merge";
import { useStore } from "zustand";

export default function RepeatSelect(props: { groupId: number }) {
  const repeat = useStore(animeStore, (state) => state.groups.find((g) => g.id === props.groupId)?.mode);
  const setGroupMode = useStore(animeStore, (state) => state.setGroupMode);

  const y = useMotionValue(0);

  return (
    <div className="relative grid h-full w-full grid-cols-subgrid grid-rows-subgrid place-content-stretch gap-2 rounded-2xl bg-gray-600">
      {Object.entries(RepeatIcons).map(([mode, value]) => {
        const handleClick = (valueY: number) => {
          setGroupMode(props.groupId, mode as RepeatMode);
          animate(y, valueY, { duration: 0.2 });
        };
        return (
          <div
            className={twMerge(
              clsx("z-10 grid h-full w-full place-content-center brightness-25 transition-all", {
                "brightness-100": repeat !== mode,
              }),
            )}
            key={mode}
            onClick={(e) => handleClick(e.currentTarget.offsetTop)}
            ref={(r) => {
              if (repeat === mode) handleClick(r ? r.offsetTop : 0);
            }}
          >
            <img className="max-h-full max-w-full" src={value.src} alt="" />
          </div>
        );
      })}
      <motion.div style={{ y }} className="absolute z-0 aspect-square w-full rounded-xl bg-white" />
    </div>
  );
}
