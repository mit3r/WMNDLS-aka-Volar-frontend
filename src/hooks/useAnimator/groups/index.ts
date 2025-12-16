import type { Pc } from "@api/Transmitter";
import type { RepeatMode, Visual } from "@hooks/useAnimator/visuals";

export interface Group {
  id: number;
  channelId: Pc.Channel;
  mode: RepeatMode;
  visuals: Visual[];
  duration: number; // in seconds
}
