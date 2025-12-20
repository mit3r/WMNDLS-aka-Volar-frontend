import type { Group } from "@hooks/useAnimator/types/groups";
import type { Player } from "../Player";
import { ChainingMode } from "@hooks/useAnimator/types/visuals";

/**
 * Creates a timeline for the given group and stores it in the player's timelines.
 * @param this Player instance
 * @param group Group for which to create the timeline
 */
export default function createTimeline(this: Player, group: Group): void {
  this.timelines[group.id] = {
    elapsed: 0,
    duration: 0,
    items: [],
  };

  let timelineCursor = group.delay;
  let previousStartTime = group.delay;
  let lastEndTime = 0;

  for (let index = 0; index < group.visuals.length; index++) {
    const visual = group.visuals[index];

    let start: number;
    if (index > 0 && visual.chaining === ChainingMode.WHEN_LAST_STARTED) {
      start = previousStartTime + visual.delay;
    } else {
      start = timelineCursor + visual.delay;
    }

    previousStartTime = start;

    const end = start + visual.duration;
    if (end > timelineCursor) timelineCursor = end;

    this.timelines[group.id].items.push({ start, end });
    if (end > lastEndTime) lastEndTime = end;
  }

  this.timelines[group.id].elapsed = 0;
  this.timelines[group.id].duration = lastEndTime;
}
