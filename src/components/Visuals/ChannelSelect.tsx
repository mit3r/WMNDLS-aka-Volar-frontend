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
      {Array.from({ length: Pc.MAX_CHANNELS }, (_, i) => i).map((i) => (
        <option key={i} value={i}>
          Channel {i + 1}
        </option>
      ))}
      <option value={Pc.BROADCAST_CHANNEL}>Broadcast</option>
      <option value={-1}>Remove Visual</option>
    </select>
  );
}