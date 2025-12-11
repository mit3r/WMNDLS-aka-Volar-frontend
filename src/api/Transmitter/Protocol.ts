export const NUM_LEDS = 50;
export const NETWORK_ID = 0xcafebe16;

export const MAX_CHANNELS = 4;
export const BROADCAST_CHANNEL = 0xff;

export enum MessageType {
  ORDER = 0,
  CONFIG = 1,
  COLORS24 = 2,
  COLORS16 = 3,
  COLORS8 = 4,
}

export type MessageColorType = MessageType.COLORS24 | MessageType.COLORS16 | MessageType.COLORS8;

export const ColorSizes: Record<MessageColorType, 1 | 2 | 3> = {
  [MessageType.COLORS24]: 3,
  [MessageType.COLORS16]: 2,
  [MessageType.COLORS8]: 1,
};

export const PayloadSizes: Record<MessageType, number> = {
  [MessageType.ORDER]: 2,
  [MessageType.CONFIG]: 4,
  [MessageType.COLORS24]: NUM_LEDS * 3,
  [MessageType.COLORS16]: NUM_LEDS * 2,
  [MessageType.COLORS8]: NUM_LEDS * 1,
};

export const PayloadMaxChannels: Record<MessageColorType, number> = {
  [MessageType.COLORS24]: 1,
  [MessageType.COLORS16]: 2,
  [MessageType.COLORS8]: 4,
};

export const HeaderFields = ["networkId", "length", "order", "type", "channels"] as const;
export type HeaderFields = (typeof HeaderFields)[number];

// Channels are 0-3 for unicast, 0xff for broadcast (with option to extend to 0-8 later)
export type Channel = 0 | 1 | 2 | 3 | typeof BROADCAST_CHANNEL;

export const HeaderSizes: Record<HeaderFields, number> = {
  networkId: 4,
  length: 1,
  order: 2,
  type: 1,
  channels: 1,
};

export const HeaderSize = HeaderFields.reduce((sum, field) => sum + HeaderSizes[field], 0);

export const HeaderOffsets: Record<HeaderFields, number> = Object.entries(HeaderSizes).reduce(
  (acc, [key], i) => {
    if (i <= 0) return acc;
    acc[key as HeaderFields] = acc[HeaderFields[i - 1]] + HeaderSizes[HeaderFields[i - 1]];
    return acc;
  },
  { networkId: 0 } as Record<HeaderFields, number>,
);

export const MaxMessageRate: Record<MessageColorType, Record<number, number>> = {
  // MAX VALUES FOR (0, 1, 2, 3, 4) DEVICES PER MESSAGE
  [MessageType.COLORS24]: [0, 71, 0, 0, 0],
  [MessageType.COLORS16]: [0, 106, 55, 0, 0],
  [MessageType.COLORS8]: [0, 196, 106, 71, 55],
};
