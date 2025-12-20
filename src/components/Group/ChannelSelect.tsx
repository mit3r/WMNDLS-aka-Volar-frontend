import { Pc } from "@api/Transmitter";
import type { GroupId } from "@hooks/useAnimator/types/groups";
import { animeStore } from "@store/animeStore";
import { optionsStore } from "@store/optionsStore";
import { useStore } from "zustand";

export default function ChannelSelect(props: { groupId: GroupId }) {
  const rgbFormat = useStore(optionsStore, (state) => state.options.rgbFormat);
  const setChannel = useStore(animeStore, (state) => state.setGroupChannel);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setChannel(props.groupId, parseInt(e.target.value) as Pc.Channel);

  return (
    <select
      name="channel-id"
      id="channel-id"
      className="h-full w-full rounded-lg bg-gray-700 p-2"
      onChange={handleChange}
    >
      {Array.from({ length: Pc.PayloadMaxChannels[rgbFormat] }, (_, i) => i).map((i) => (
        <option key={i} value={i}>
          Channel {i + 1}
        </option>
      ))}
      <option value={Pc.BROADCAST_CHANNEL}>Broadcast</option>
    </select>
  );
}
