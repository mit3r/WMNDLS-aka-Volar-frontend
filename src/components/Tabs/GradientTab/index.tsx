import { useStore } from "zustand";
import Composer from "./Composer";
import { globalStore } from "@store/globalStore";

export default function GradientTab() {
  const editChannel = useStore(globalStore, (state) => state.editChannel);

  return (
    <div className="p-4">
      {/* <Palete /> */}

      {editChannel !== null && <Composer channelId={editChannel} />}
    </div>
  );
}
