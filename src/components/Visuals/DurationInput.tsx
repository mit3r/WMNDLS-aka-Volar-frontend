import { animeStore } from "@store/animeStore";
import { useStore } from "zustand";
import NumberInput from "../Inputs/NumberInput";

export default function DurationInput(props: { groupId: number; visualId: number }) {
  const setVisualDuration = useStore(animeStore, (state) => state.setVisualDuration);

  const duration = useStore(animeStore, (state) => {
    const group = state.groups.find((g) => g.id === props.groupId);
    const visual = group?.visuals.find((v) => v.id === props.visualId);
    return visual?.duration || 0;
  });

  return <NumberInput title="DURATION" value={duration} onChange={setVisualDuration} />;
}
