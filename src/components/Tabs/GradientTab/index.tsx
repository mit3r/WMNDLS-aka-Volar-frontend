import { useStore } from "zustand";
import Composer from "./Composer";
import { animeStore } from "@store/animeStore";

export default function GradientTab() {
  const editableVisualId = useStore(animeStore, (state) => state.editableVisualId);

  return <div className="p-4">{editableVisualId !== null && <Composer visualId={editableVisualId} />}</div>;
}
