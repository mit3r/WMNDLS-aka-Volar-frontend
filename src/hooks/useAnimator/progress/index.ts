export interface Progress {
  groupId: number;
  progress: number | null; // [0.0 - 1.0], null means not started
}
