import type { Group } from "../../types/groups";
import { RepeatMode } from "../../types/visuals";
import type { Player } from "../Player";

/**
 * Handles updating the group's elapsed time and mode.
 * @param group Group to update
 * @param deltaTime Elapsed time since last frame in milliseconds
 * @returns Whether the group was updated and should be animated
 */
export default function moveTimeline(this: Player, group: Group, deltaTime: number): boolean {
  if (group.mode === RepeatMode.STOP) {
    this.timelines[group.id].elapsed = 0;
    return false;
  }

  // Prevent elapsed time overflow
  if (this.timelines[group.id].elapsed + deltaTime > this.timelines[group.id].duration) {
    this.timelines[group.id].elapsed = 0;
    return group.mode === RepeatMode.FOREVER;
  }

  const elapsed = this.timelines[group.id].elapsed + deltaTime;
  this.timelines[group.id].elapsed = elapsed;
  return true;
}
