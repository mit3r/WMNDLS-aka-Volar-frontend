import mod from "@utils/mod";
import type { Group } from "../../types/groups";
import { RepeatMode } from "../../types/visuals";
import type { Player } from "../Player";

/**
 * Handles updating the group's elapsed time and mode.
 * @param group Group to update
 * @param deltaTime Elapsed time since last frame in milliseconds
 * @returns Whether the group was updated and should be animated
 */
export default function moveTimeline(this: Player, group: Group, deltaTime: number): RepeatMode {
  if (group.mode === RepeatMode.STOP) {
    this.timelines[group.id].elapsed = 0;
    return RepeatMode.STOP;
  }

  const newElapsed = this.timelines[group.id].elapsed + deltaTime;
  this.timelines[group.id].elapsed = mod(newElapsed, this.timelines[group.id].duration);

  if (newElapsed >= this.timelines[group.id].duration && group.mode === RepeatMode.ONCE) {
    this.timelines[group.id].elapsed = this.timelines[group.id].duration;
    return RepeatMode.STOP;
  }

  return group.mode;
}
