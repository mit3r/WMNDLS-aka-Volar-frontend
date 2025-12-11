import { Pc } from "@api/Transmitter";
import RepeatSelect from "./RepeatSelect";
import SpeedSelect from "./SpeedSelect";
import GradientDisplay from "./GradientDisplay";
import PushButton from "./PushButton";
import EffectSelect from "./EffectSelect";
import { useStore } from "zustand";
import { optionsStore } from "@store/optionsStore";
import { useMemo } from "react";

export default function Channels() {
  const multicastChannelsNum = useStore(optionsStore, (state) => state.options.multicastChannelsNum);
  const broadcastChannelActive = useStore(optionsStore, (state) => state.options.broadcastChannelActive);

  const channelsElements = useMemo(() => {
    const elements = [];
    for (let i = 0; i < multicastChannelsNum; i++) elements.push(<Channel key={i} channelId={i as Pc.Channel} />);
    if (broadcastChannelActive) elements.push(<Channel key={"B"} channelId={Pc.BROADCAST_CHANNEL} />);
    return elements;
  }, [multicastChannelsNum, broadcastChannelActive]);

  return <div className="flex h-full w-fit gap-4 p-4">{channelsElements}</div>;
}

function Channel(props: { channelId: Pc.Channel }) {
  return (
    <div className="relative flex h-full w-[195px] flex-col items-center justify-start gap-4 overflow-clip rounded-tl-4xl rounded-br-4xl bg-gray-800 p-4 text-white">
      Channel {props.channelId}
      <div className="grid w-full grid-cols-2 grid-rows-1 gap-4">
        <RepeatSelect channelId={props.channelId} />
        <SpeedSelect channelId={props.channelId} />
      </div>
      <GradientDisplay channelId={props.channelId} />
      <EffectSelect channelId={props.channelId} />
      <PushButton channelId={props.channelId} />
    </div>
  );
}
