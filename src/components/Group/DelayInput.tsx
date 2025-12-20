import { animeStore } from "@store/animeStore";
import { useStore } from "zustand";
import NumberInput from "../Inputs/NumberInput";

export default function DelayInput(props: { groupId: number }) {
  const setGroupDelay = useStore(animeStore, (state) => state.setGroupDelay);

  const handleChange = (newDelay: number) => setGroupDelay(props.groupId, newDelay);

  const delay = useStore(animeStore, (state) => {
    const group = state.groups.find((g) => g.id === props.groupId);
    return group?.delay || 0;
  });

  return <NumberInput title="DELAY" value={delay} onChange={handleChange} />;
}
