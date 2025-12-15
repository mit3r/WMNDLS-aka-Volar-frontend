import { visualStore } from "@store/visualStore";
import { useMemo } from "react";
import { useStore } from "zustand";
import ChannelSelect from "./ChannelSelect";
import GradientDisplay from "./GradientDisplay";
import RepeatSelect from "./RepeatSelect";
import SpeedSelect from "./SpeedSelect";
import EffectSelect from "./EffectSelect";
import PushButton from "./PushButton";
import { motion } from "motion/react";

export default function Visuals() {
  const visuals = useStore(visualStore, (state) => state.visuals);
  const addVisual = useStore(visualStore, (state) => state.addVisual);

  const visualElements = useMemo(() => {
    return visuals.map((id) => <Visual key={id} visualId={id} />);
  }, [visuals]);


  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 w-full h-svh overflow-y-auto">{visualElements}
    <div className="h-[50svh] p-2 grid place-content-center">
      <motion.button
        className="rounded-2xl border-2 border-white px-8 py-2 text-white"
      onClick={addVisual}
        >
          Add Visual
        </motion.button>
    </div>
    </div>
  );
}

function Visual(props: { visualId: number }) {
  return (
    <div className="h-[50svh] p-2">
      <div className="relative gap-2 overflow-clip rounded-tl-4xl rounded-br-4xl bg-gray-800 p-4 text-white grid grid-cols-2">
        <div className="col-span-2 row-span-1">
          <ChannelSelect visualId={props.visualId} />
        </div>
        <div className="col-span-1 row-span-3">
          <GradientDisplay visualId={props.visualId} />
        </div>
          <RepeatSelect visualId={props.visualId} />
          <SpeedSelect visualId={props.visualId} />
          <EffectSelect visualId={props.visualId} />
        
          <div className="col-span-2">
            <PushButton visualId={props.visualId} />
          </div>
        
        </div>
    </div>
     
  );
}
