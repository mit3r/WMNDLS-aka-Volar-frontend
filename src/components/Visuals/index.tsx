import { animeStore } from "@store/animeStore";
import { motion, Reorder } from "motion/react";
import { useStore } from "zustand";
import GradientDisplay from "./GradientDisplay";
import RemoveButton from "./RemoveButton";
import ChainingSelector from "./ChainingSelector";
import { useShallow } from "zustand/shallow";
import DurationInput from "./DurationInput";
import EffectSelect from "./EffectSelect";

export default function Visuals(props: { groupId: number }) {
  const visuals = useStore(animeStore, (state) => state.groups.find((g) => g.id === props.groupId)?.visuals || []);

  const visualsOrder = useStore(
    animeStore,
    useShallow((state) => state.getVisualsOrder()),
  );

  const setVisualsOrder = useStore(animeStore, (state) => state.setVisualsOrder);
  const addVisual = useStore(animeStore, (state) => state.addVisual);

  const handleScroll = (e: React.WheelEvent) =>
    e.currentTarget.scrollBy({ left: Math.sign(e.deltaY) * -100, behavior: "smooth" });

  return (
    <Reorder.Group
      axis="x"
      values={visualsOrder}
      onReorder={setVisualsOrder}
      className="flex h-full flex-row items-center gap-4 overflow-x-auto"
      onWheel={handleScroll}
    >
      {visuals.map((visual) => (
        <Visual key={visual.id} groupId={props.groupId} visualId={visual.id} />
      ))}

      <motion.button
        className="aspect-square shrink-0 rounded-2xl border-2 border-white p-2 text-white"
        onClick={addVisual}
      >
        Add
      </motion.button>
    </Reorder.Group>
  );
}

function Visual(props: { groupId: number; visualId: number }) {
  const setEditableVisualId = useStore(animeStore, (state) => state.setEditableVisualId);
  const handleCapture = () => setEditableVisualId(props.visualId);

  const setVisualDuration = useStore(animeStore, (state) => state.setVisualDuration);
  const duration = useStore(animeStore, (state) => {
    const group = state.groups.find((g) => g.id === props.groupId);
    const visual = group?.visuals.find((v) => v.id === props.visualId);
    return visual?.duration || 0;
  });

  return (
    <Reorder.Item
      drag="x"
      value={props.visualId}
      key={props.visualId}
      className="grid aspect-1/2 h-full grid-flow-col grid-cols-2 grid-rows-4 gap-1 rounded-2xl bg-gray-700 p-1 text-white"
      onClickCapture={handleCapture}
    >
      <div className="row-span-4">
        <GradientDisplay groupId={props.groupId} visualId={props.visualId} />
      </div>

      <RemoveButton groupId={props.groupId} visualId={props.visualId} />
      <EffectSelect groupId={props.groupId} visualId={props.visualId} />
      <DurationInput value={duration} onChange={setVisualDuration} />
      <ChainingSelector groupId={props.groupId} visualId={props.visualId} />
    </Reorder.Item>
  );
}
