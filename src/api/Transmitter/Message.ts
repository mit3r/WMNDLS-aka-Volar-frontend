import { CRGB } from "./Color";
import * as Pc from "./Protocol";

let maxSize = Pc.HeaderSize;
for (const msgType of [
  Pc.MessageType.COLORS8,
  Pc.MessageType.COLORS16,
  Pc.MessageType.COLORS24,
] as Pc.MessageColorType[]) {
  maxSize = Math.max(maxSize, Pc.HeaderSize + Pc.PayloadSizes[msgType] * Pc.PayloadMaxChannels[msgType]);
}

console.log("Max message size:", maxSize);

export default class Message {
  private binary = new ArrayBuffer(maxSize);
  private view = new DataView(this.binary);

  private channelsColorPayloads: { [key in Pc.Channel]?: Uint8Array } = {};

  constructor() {
    this.bNetworkId = Pc.NETWORK_ID;
    this.bLength = Pc.HeaderSize;
    this.bOrder = 0;
    this.bType = Pc.MessageType.ORDER;
  }

  private set bNetworkId(networkId: number) {
    this.view.setUint32(Pc.HeaderOffsets.networkId, networkId, true);
  }

  private set bLength(length: number) {
    this.view.setUint8(Pc.HeaderOffsets.length, length);
  }

  private get bLength(): number {
    return this.view.getUint8(Pc.HeaderOffsets.length);
  }

  public set bOrder(order: number) {
    this.view.setUint16(Pc.HeaderOffsets.order, order, true);
  }

  public get bOrder(): number {
    return this.view.getUint16(Pc.HeaderOffsets.order, true);
  }

  public set bType(type: Pc.MessageType) {
    this.channelsColorPayloads = {}; // reset payloads when type changes
    this.view.setUint8(Pc.HeaderOffsets.type, type);
  }

  public get bType(): Pc.MessageType {
    return this.view.getUint8(Pc.HeaderOffsets.type);
  }

  private get bChannels(): number {
    return this.view.getUint8(Pc.HeaderOffsets.channels);
  }

  private set bChannels(id: Pc.Channel) {
    const newChannels: number = id === Pc.BROADCAST_CHANNEL ? Pc.BROADCAST_CHANNEL : 1 << id;
    this.view.setUint8(Pc.HeaderOffsets.channels, this.bChannels | newChannels);
  }

  /** Get list of unicast channels set in bChannels bitmask(less significant bit first) */
  private get channels(): Pc.Channel[] {
    if (this.isBroadcastChannelSet) return [Pc.BROADCAST_CHANNEL];
    const channels: Pc.Channel[] = [];
    for (let i = 0; i < 4; i++) if (this.bChannels & (1 << i)) channels.push(i as Pc.Channel);
    return channels;
  }

  /** Check if broadcast channel is set in bChannels bitmask */
  private get isBroadcastChannelSet(): boolean {
    return this.bChannels === Pc.BROADCAST_CHANNEL;
  }

  /** Check if any unicast channels are set in bChannels bitmask */
  private get isUnicastChannelsSet(): boolean {
    return this.bChannels !== 0 && !this.isBroadcastChannelSet;
  }

  /** Check if any channels are set in bChannels bitmask */
  private get isAnyChannelSet(): boolean {
    return this.bChannels !== 0;
  }

  /** Set color payload for given channel */
  public setColorChannel(channelId: Pc.Channel, colors: CRGB[]): void {
    if (colors.length !== Pc.NUM_LEDS) throw new Error("Invalid colors length");

    if (![Pc.MessageType.COLORS8, Pc.MessageType.COLORS16, Pc.MessageType.COLORS24].includes(this.bType))
      throw new Error("Invalid message type for color payload");

    if (channelId !== Pc.BROADCAST_CHANNEL && this.isBroadcastChannelSet)
      throw new Error("Cannot set unicast channel when broadcast channel is already set");

    if (channelId === Pc.BROADCAST_CHANNEL && this.isUnicastChannelsSet)
      throw new Error("Cannot set broadcast channel when other channels are already set");

    const maxChannels = Pc.PayloadMaxChannels[this.bType as Pc.MessageColorType];
    if (this.channels.length >= maxChannels && !this.channels.includes(channelId))
      throw new Error("Exceeded maximum number of channels for message type");

    const colorSize = Pc.ColorSizes[this.bType as Pc.MessageColorType];

    this.bChannels = channelId;
    this.channelsColorPayloads[channelId] = new Uint8Array(Pc.NUM_LEDS * colorSize);

    for (let i = 0; i < Pc.NUM_LEDS; i++)
      this.channelsColorPayloads[channelId].set(colors[i].toBytes(colorSize), i * colorSize);
  }

  /** Prepare color payloads for each channel */
  private setColorPayloads(): void {
    if (![Pc.MessageType.COLORS8, Pc.MessageType.COLORS16, Pc.MessageType.COLORS24].includes(this.bType)) return;

    const maxPayloads = Pc.PayloadMaxChannels[this.bType as Pc.MessageColorType];
    const colorSize = Pc.ColorSizes[this.bType as Pc.MessageColorType];
    const payloadSize = Pc.PayloadSizes[this.bType as Pc.MessageColorType];

    const channels: Pc.Channel[] = this.channels;
    if (channels.length <= 0) throw new Error("No channels set for message");
    if (channels.length > maxPayloads) throw new Error("Too many unicast channels set for message type");

    // offsetToPayloads = Pc.HeaderSize;
    // offsetToChannel = c * payloadSize;
    // offsetToLed = l * colorSize;
    // offsetToByte = b;

    for (let c = 0; c < channels.length; c++) {
      const payload = this.channelsColorPayloads[channels[c]];
      if (!payload) throw new Error(`No payload set for channel ${channels[c]}`);

      for (let l = 0; l < Pc.NUM_LEDS; l++)
        for (let b = 0; b < colorSize; b++)
          this.view.setUint8(Pc.HeaderSize + c * payloadSize + l * colorSize + b, payload[l * colorSize + b]);
    }

    this.bLength = Pc.HeaderSize + channels.length * payloadSize;
  }

  public reset(): void {
    this.bLength = Pc.HeaderSize;
    this.channelsColorPayloads = {};
  }

  /** Return formed binary message and reset internal state */
  public getBinary(): { buffer: ArrayBuffer; length: number } {
    if (!this.isAnyChannelSet) throw new Error("No channels set in message before building binary");
    this.setColorPayloads();

    return { buffer: this.binary.slice(0, this.bLength), length: this.bLength };
  }
}

// const testMsg = new Message();

// testMsg.bType = Pc.MessageType.COLORS8;
// testMsg.setColorChannel(0, Array(Pc.NUM_LEDS).fill(new CRGB(255, 0, 0)));
// testMsg.setColorChannel(1, Array(Pc.NUM_LEDS).fill(new CRGB(0, 255, 0)));
// testMsg.setColorChannel(2, Array(Pc.NUM_LEDS).fill(new CRGB(0, 0, 255)));
// testMsg.setColorChannel(3, Array(Pc.NUM_LEDS).fill(new CRGB(255, 255, 0)));

// prettyPrintMessage(testMsg);
