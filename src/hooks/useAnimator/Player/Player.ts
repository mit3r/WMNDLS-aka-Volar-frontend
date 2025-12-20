import type { TransmitQueueItem } from "./handlers/transmitQueue";
import type { Group, GroupId } from "../types/groups";
import createTimeline from "./handlers/createTimeline";
import moveTimeline from "./handlers/moveTimeline";
import renderAnimationFrame from "./handlers/renderFrame";
import type { Timeline } from "./types";
import transmitQueue from "./handlers/transmitQueue";
import { animeStore } from "@store/animeStore";
import { RepeatMode } from "../types/visuals";

export class Player {
  // Timelines per group cached
  timelines: Record<GroupId, Timeline> = {};
  private createTimeline = createTimeline;

  // Simple elapsed time tracker
  private lastFrameTimestamp = null as number | null;
  private getElapsed() {
    let elapsedTime = 0;
    if (this.lastFrameTimestamp !== null) {
      elapsedTime = (Date.now() - this.lastFrameTimestamp) / 1000;
    }
    this.lastFrameTimestamp = Date.now();
    return elapsedTime;
  }

  private renderAnimationFrame = renderAnimationFrame;
  private moveTimeline = moveTimeline;
  private transmitQueue = transmitQueue;

  constructor() {}

  public setup(groups: Group[]) {
    for (const group of groups) this.createTimeline(group);
  }

  public loop(groups: Group[]) {
    const queue: TransmitQueueItem[] = [];
    const elapsed = this.getElapsed();

    for (const group of groups) {
      if (this.moveTimeline(group, elapsed)) {
        const item = this.renderAnimationFrame(group);
        if (item !== null) queue.push(item);
      } else {
        animeStore.getState().setGroupMode(group.id, RepeatMode.STOP);
      }
    }

    this.transmitQueue(queue);
  }

  public teardown() {}
}
