import TabsComponent from "@components/Tabs";
// import useAnimator from "@hooks/useAnimator";
import GroupsComponent from "@components/Group";
import useAnimator from "@hooks/useAnimator";
import PortModal from "@components/PortModal";

export default function App() {
  useAnimator();

  return (
    <div className="flex h-svh w-svw overflow-clip">
      <PortModal />

      <div className="flex-1 overflow-x-auto bg-gray-700">
        <GroupsComponent />
      </div>

      <div className="h-full w-[26vw] min-w-[20rem] max-w-[32rem] shrink-0 border-l-2 border-gray-500 bg-gray-800">
        <TabsComponent />
      </div>
    </div>
  );
}
