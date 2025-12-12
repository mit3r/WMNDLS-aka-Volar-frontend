import { visualStore } from "@store/visualStore";
import { useStore } from "zustand";
import Composer from "./Composer";

export default function GradientTab() {
  const editableVisualId = useStore(visualStore, (state) => state.editableVisualId);

  return (
    <div className="p-4">
      {/* <Palete /> */}

      {editableVisualId !== null && <Composer visualId={editableVisualId} />}
    </div>
  );
}
