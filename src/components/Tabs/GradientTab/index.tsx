import { useStore } from "zustand";
import Composer from "./Composer";
import { animeStore } from "@store/animeStore";

export default function GradientTab() {
  const editableVisualId = useStore(animeStore, (state) => state.editableVisualId);

  return (
    <div className="h-full p-4">
      {editableVisualId !== null ? (
        <Composer visualId={editableVisualId} />
      ) : (
        <div className="flex w-full flex-col items-center text-white">
          <h2 className="text-center text-xl">No visual selected.</h2>
          <p className="mt-2 text-justify text-sm">Please select a visual from the list to edit its gradient.</p>
        </div>
      )}
    </div>
  );
}
