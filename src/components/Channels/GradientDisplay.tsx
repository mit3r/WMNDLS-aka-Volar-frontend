import type { Pc } from "@api/Transmitter";
import { globalStore } from "@store/globalStore";
import { gradientStore } from "@store/gradientStore";
import { motion } from "motion/react";
import { useCallback, useMemo } from "react";
import { useStore } from "zustand";

export default function GradientDisplay(props: { channelId: Pc.Channel }) {
  const setTab = useStore(globalStore, (state) => state.setTab);
  const setEditChannel = useStore(globalStore, (state) => state.setEditChannel);

  const handleClick = useCallback(() => {
    setEditChannel(props.channelId);
    setTab("color");
  }, [setEditChannel, setTab, props.channelId]);

  const gradient = useStore(gradientStore, (state) => state.gradients[props.channelId]);
  const length = useMemo(() => (gradient.length <= 1 ? 2 : gradient.length), [gradient]);

  const background = useMemo(
    () =>
      `linear-gradient(0deg, ${gradient
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
