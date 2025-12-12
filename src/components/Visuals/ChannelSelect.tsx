import { Pc } from "@api/Transmitter";
import { visualStore } from "@store/visualStore";
import { useStore } from "zustand";


export default function ChannelSelect(props: { visualId: number }) {
  const setChannel = useStore(visualStore, (state) => state.setChannel);
  const removeVisual = useStore(visualStore, (state) => state.removeVisual);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value) as Pc.Channel | -1;
    if (value === -1) return removeVisual(props.visualId);
    setChannel(props.visualId, value);
  }

  return (
    <select name="channel-id" id="channel-id" className="w-full bg-gray-700 rounded-lg p-2"
      onChange={handleChange}
    >
      <option value={0}>Channel 1</option>
      <option value={1}>Channel 2</option>
      <option value={2}>Channel 3</option>
      <option value={3}>Channel 4</option>
      <option value={Pc.BROADCAST_CHANNEL}>Broadcast</option>
      <option value={-1}>Remove Visual</option>
    </select>
  );
}