import { MessageType, type MessageColorType } from "@api/Transmitter/Protocol";

export enum AnimatorOptionsType {
  REALTIME_UPDATE = "realtimeUpdate",
  MULTICAST_CHANNELS_NUM = "multicastChannelsNum",
  BROADCAST_CHANNEL_ACTIVE = "broadcastChannelActive",
  RGB_FORMAT = "rgbFormat",
}

export const MAX_FPS_LIMIT: Record<MessageColorType, Record<number, number>> = {
  [MessageType.COLORS24]: {
    1: 70, // max for 24bit, 1 channel
    2: 35, // max for 24bit, 2 channels
  },
  [MessageType.COLORS16]: {
    1: 100, // max for 16bit, 1 channel
    2: 50, // max for 16bit, 2 channels
    3: 33, // max for 16bit, 3 channels
    4: 25, // max for 16bit, 4 channels
  },
  [MessageType.COLORS8]: {
    1: 180, // max for 8bit, 1 channel
    2: 90, // max for 8bit, 2 channels
    3: 60, // max for 8bit, 3 channels
    4: 45, // max for 8bit, 4 channels
  },
};

export type AnimatorOptions = {
  [AnimatorOptionsType.REALTIME_UPDATE]: boolean;
  [AnimatorOptionsType.BROADCAST_CHANNEL_ACTIVE]: boolean;
  [AnimatorOptionsType.MULTICAST_CHANNELS_NUM]: 1 | 2 | 3 | 4;
  [AnimatorOptionsType.RGB_FORMAT]: MessageColorType;
};

export const defaultAnimatorOptions: AnimatorOptions = {
  [AnimatorOptionsType.REALTIME_UPDATE]: true,
  [AnimatorOptionsType.BROADCAST_CHANNEL_ACTIVE]: true,
  [AnimatorOptionsType.MULTICAST_CHANNELS_NUM]: 1,
  [AnimatorOptionsType.RGB_FORMAT]: MessageType.COLORS24,
};
