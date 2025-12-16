import ChannelSelect from "@components/Group/ChannelSelect";
import Visuals from "@components/Visuals";
import { animeStore } from "@store/animeStore";
import { Reorder } from "framer-motion";
import { useStore } from "zustand";
import { useShallow } from "zustand/shallow";
import PlayButton from "./PushButton";
import RepeatSelect from "./RepeatSelect";

/** Group component contains visuals for a given channel. */
export default function GroupsComponent() {
  const setGroupOrder = useStore(animeStore, (state) => state.setGroupOrder);

  const groupOrder = useStore(
    animeStore,
    useShallow((state) => state.getGroupOrder()),
  );

  const addGroup = useStore(animeStore, (state) => state.addGroup);

  return (
    <Reorder.Group
      values={groupOrder}
      onReorder={setGroupOrder}
      className="flex h-svh w-full flex-col justify-start gap-4 overflow-y-auto p-4"
    >
      {groupOrder.map((groupId) => (
        <GroupComponent key={groupId} groupId={groupId} />
      ))}

      <button onClick={addGroup}>Add Group</button>
    </Reorder.Group>
  );
}

function GroupComponent(props: { groupId: number }) {
  const setEditGroupId = useStore(animeStore, (state) => state.setEditableGroupId);
  const handleClickCapture = () => setEditGroupId(props.groupId);

  return (
    <Reorder.Item
      drag="y"
      value={props.groupId}
      key={props.groupId}
      className="relative grid h-[33svh] shrink-0 grid-cols-[auto_auto_1fr] grid-rows-3 gap-2 overflow-clip rounded-tl-4xl rounded-br-4xl bg-gray-800 p-4 text-white shadow-sm shadow-black"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      onClickCapture={handleClickCapture}
    >
      <div className="col-span-2">
        <ChannelSelect groupId={props.groupId} />
      </div>
      <div className="col-span-2">
        <RepeatSelect groupId={props.groupId} />
      </div>
      <div className="col-span-2">
        <PlayButton groupId={props.groupId} />
      </div>

      <div className="col-start-3 row-span-3 row-start-1 overflow-x-auto rounded-2xl border-2 border-gray-700 p-1">
        <Visuals groupId={props.groupId} />
      </div>
    </Reorder.Item>
  );
}
