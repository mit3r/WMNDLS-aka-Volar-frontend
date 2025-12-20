import { Message, Pc, transmitter, type CRGB } from "@api/Transmitter";
import { optionsStore } from "@store/optionsStore";

export interface TransmitQueueItem {
  channelId: Pc.Channel;
  colors: CRGB[];
}

export default function transmitQueue(items: TransmitQueueItem[]) {
  const options = optionsStore.getState().options;

  while (items.length > 0) {
    const message = new Message();
    message.bType = options.rgbFormat;

    const count = Math.min(items.length, Pc.PayloadMaxChannels[options.rgbFormat]);

    for (let i = 0; i < count; i++) {
      const { channelId, colors } = items.pop()!;
      message.setColorChannel(channelId, colors);
    }

    transmitter.sendMessage(message);
  }
}
