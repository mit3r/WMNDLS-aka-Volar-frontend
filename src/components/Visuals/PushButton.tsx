import { visualStore } from "@store/visualStore";

import { useCallback } from "react";
import { useStore } from "zustand";

export default function PushButton(props: { visualId: number }) {

  const pushProgress = useStore(visualStore, (state) => state.pushProgress);

  const handlePress = useCallback(() => {
    pushProgress(props.visualId);
  }, [pushProgress, props.visualId]);

  return (
    <button className="bg-strips aspect-[3] w-full rounded-2xl border-2 text-2xl font-extralight tracking-widest uppercase shadow-black transition-all active:scale-95 active:shadow-md" onClick={handlePress}>
      Press
    </button>
  );
}
