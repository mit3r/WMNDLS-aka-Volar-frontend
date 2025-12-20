import { animeStore } from "@store/animeStore";
import { useStore } from "zustand";
import NumberInput from "../Inputs/NumberInput";

export default function DelayInput(props: { groupId: number; visualId: number }) {
  const setVisualDelay = useStore(animeStore, (state) => state.setVisualDelay);

  const delay = useStore(animeStore, (state) => {
    const group = state.groups.find((g) => g.id === props.groupId);
    const visual = group?.visuals.find((v) => v.id === props.visualId);
    return visual?.delay || 0;
  });

  return <NumberInput title="DELAY" value={delay} onChange={setVisualDelay} />;
}
