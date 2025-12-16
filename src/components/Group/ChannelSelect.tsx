import { Pc } from "@api/Transmitter";
import { animeStore } from "@store/animeStore";
import { optionsStore } from "@store/optionsStore";
import { useStore } from "zustand";

export default function ChannelSelect(props: { groupId: number }) {
  const rgbFormat = useStore(optionsStore, (state) => state.options.rgbFormat);
  const setChannel = useStore(animeStore, (state) => state.setGroupChannel);
  const removeGroup = useStore(animeStore, (state) => state.removeGroup);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value) as Pc.Channel | -1;
    if (value === -1) return removeGroup(props.groupId);
    setChannel(value);
  };

  return (
    <select name="channel-id" id="channel-id" className="rounded-lg bg-gray-700 p-2" onChange={handleChange}>
      {Array.from({ length: Pc.PayloadMaxChannels[rgbFormat] }, (_, i) => i).map((i) => (
        <option key={i} value={i}>
          Channel {i + 1}
        </option>
      ))}
      <option value={Pc.BROADCAST_CHANNEL}>Broadcast</option>
      <option value={-1}>Remove Visual</option>
    </select>
  );
}
