import { animeStore } from "@store/animeStore";
import { useStore } from "zustand";
import NumberInput from "../Inputs/NumberInput";

export default function DurationInput(props: { groupId: number }) {
  const setGroupDuration = useStore(animeStore, (state) => state.setGroupDuration);

  const handleChange = (value: number) => setGroupDuration(props.groupId, value);

  const duration = useStore(animeStore, (state) => {
    const group = state.groups.find((g) => g.id === props.groupId);
    return group?.duration || 0;
  });

  return <NumberInput title="DURATION" value={duration} onChange={handleChange} />;
}
