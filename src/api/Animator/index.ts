import { MessageType, type MessageColorType } from "@api/Transmitter/Protocol";

export enum AnimatorOptionsType {
  BROADCAST_CHANNEL_ACTIVE = "broadcastChannelActive",
  RGB_FORMAT = "rgbFormat",
}

export const MAX_FPS_LIMIT: Record<MessageColorType, number> = {
  [MessageType.COLORS24]: 70,
  [MessageType.COLORS16]: 100,
  [MessageType.COLORS8]: 180,
};

export type AnimatorOptions = {
  [AnimatorOptionsType.BROADCAST_CHANNEL_ACTIVE]: boolean;
  [AnimatorOptionsType.RGB_FORMAT]: MessageColorType;
};

export const defaultAnimatorOptions: AnimatorOptions = {
  [AnimatorOptionsType.BROADCAST_CHANNEL_ACTIVE]: true,
  [AnimatorOptionsType.RGB_FORMAT]: MessageType.COLORS24,
};
