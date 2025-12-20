import { animeStore } from "@store/animeStore";
import { motion, Reorder } from "motion/react";
import { useStore } from "zustand";
import GradientDisplay from "./GradientDisplay";
import ChainingSelector from "./ChainingSelector";
import { useShallow } from "zustand/shallow";
import DurationInput from "./DurationInput";
import EffectSelect from "./EffectSelect";
import DelayInput from "./DelayInput";
import RemoveButton from "@components/Inputs/RemoveButton";

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
      className="flex h-full flex-row items-center gap-4 overflow-y-clip"
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
  const removeVisual = useStore(animeStore, (state) => state.removeVisual);

  return (
    <Reorder.Item
      drag="x"
      value={props.visualId}
      key={props.visualId}
      className="grid aspect-1/2 h-full grid-flow-col grid-cols-2 grid-rows-4 gap-1 rounded-2xl bg-gray-700 p-1 text-white"
      onClickCapture={handleCapture}
    >
      <div className="row-span-3">
        <GradientDisplay groupId={props.groupId} visualId={props.visualId} />
      </div>

      <RemoveButton onClick={() => removeVisual(props.groupId, props.visualId)} />
      <EffectSelect groupId={props.groupId} visualId={props.visualId} />
      <DelayInput groupId={props.groupId} visualId={props.visualId} />
      <DurationInput groupId={props.groupId} visualId={props.visualId} />
      <ChainingSelector groupId={props.groupId} visualId={props.visualId} />
    </Reorder.Item>
  );
}
