import Visuals from "@components/Visuals";
import Tabs from "@components/Tabs";
import useAnimator from "@hooks/useAnimator";
import PortModal from "@components/PortModal";

export default function App() {
  useAnimator();

  return (
    <div className="flex h-svh w-svw overflow-clip">
      <PortModal />

      <div className="h-full flex-1 overflow-x-auto bg-gray-700">
        <Visuals />
      </div>

      <div className="h-full w-[30vw] border-l-2 border-gray-500 bg-gray-800">
        <Tabs />
      </div>
    </div>
  );
}
