import type { Pc } from "@api/Transmitter";
import type { RepeatMode, Visual } from "@hooks/useAnimator/types/visuals";

export type GroupId = number;

export interface Group {
  id: GroupId;
  channelId: Pc.Channel;
  mode: RepeatMode;
  visuals: Visual[];
  delay: number; // in seconds
}
