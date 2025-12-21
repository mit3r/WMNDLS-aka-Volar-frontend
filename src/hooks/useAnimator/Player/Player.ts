import { animeStore } from "@store/animeStore";
import type { Group, GroupId } from "../types/groups";
import createTimeline from "./handlers/createTimeline";
import moveTimeline from "./handlers/moveTimeline";
import renderAnimationFrame from "./handlers/renderFrame";
import type { TransmitQueueItem } from "./handlers/transmitQueue";
import transmitQueue from "./handlers/transmitQueue";
import type { Timeline } from "./types";
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
      const mode = this.moveTimeline(group, elapsed);
      if (mode !== group.mode) animeStore.getState().setGroupMode(group.id, mode);
      console.log("Group", group.id, "elapsed:", this.timelines[group.id].elapsed, "mode:", mode);

      if (mode === RepeatMode.STOP) continue;

      const item = this.renderAnimationFrame(group);
      if (item !== null) queue.push(item);
    }

    this.transmitQueue(queue);
  }

  public teardown() {}
}
