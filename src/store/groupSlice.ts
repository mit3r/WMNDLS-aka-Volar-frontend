import type { Group } from "@hooks/useAnimator/groups";
import { produce } from "immer";
import type { StateCreator } from "zustand";
import type { AnimeStore } from "./animeStore";
import { Pc } from "@api/Transmitter";
import { RepeatMode } from "@hooks/useAnimator/visuals";
import type { Progress } from "@hooks/useAnimator/progress";
import mod from "@utils/mod";

export interface GroupSlice {
  groups: Group[];
  progress: Progress[];

  // adding/removing groups
  addGroup: () => void;
  removeGroup: (groupId: number) => void;

  // Handling groups order
  // setGroups: (newGroups: Group[]) => void;
  getGroupOrder: () => number[];
  setGroupOrder: (order: number[]) => void;

  // Currently editable group
  editableGroupId: number | null;
  setEditableGroupId: (groupId: number | null) => void;

  // Modifying group properties
  setGroupChannel: (channelId: Group["channelId"]) => void;
  setGroupMode: (mode: Group["mode"]) => void;

  startGroupTimer: (groupId: number) => void;
  resetGroupTimer: (groupId: number) => void;
  handleGroupsProgresses: (deltaTime: number) => void;
}

let groupIndexer = 1;

export const groupSlice: StateCreator<AnimeStore, [], [], GroupSlice> = (set, get) => ({
  groups: [],
  progress: [],

  addGroup: () =>
    set(
      produce((state: AnimeStore) => {
        const groupId = groupIndexer++;

        state.groups.push({
          id: groupId,
          channelId: Pc.BROADCAST_CHANNEL,
          mode: RepeatMode.OFF,
          visuals: [],
          duration: 0,
        });

        state.progress.push({
          groupId: groupId,
          progress: null,
        });
      }),
    ),

  removeGroup: (groupId: number) =>
    set(
      produce((state: AnimeStore) => {
        state.groups = state.groups.filter((group) => group.id !== groupId);
        state.progress = state.progress.filter((p) => p.groupId !== groupId);
        state.editableGroupId = state.editableGroupId === groupId ? null : state.editableGroupId;
      }),
    ),

  getGroupOrder: () => get().groups.map((g) => g.id),

  setGroupOrder: (order: number[]) =>
    set(
      produce((state: AnimeStore) => {
        const newGroups: Group[] = [];
        for (const id of order) {
          const group = state.groups.find((g) => g.id === id);
          if (group) newGroups.push(group);
        }
        state.groups = newGroups;
      }),
    ),

  editableGroupId: null,

  setEditableGroupId: (groupId: number | null) =>
    set(
      produce((state: AnimeStore) => {
        console.log("Setting editableGroupId to:", groupId);

        state.editableGroupId = groupId;
      }),
    ),

  setGroupChannel: (channelId: Group["channelId"]) =>
    set(
      produce((state: AnimeStore) => {
        const groupIndex = state.groups.findIndex((g) => g.id === get().editableGroupId);
        if (groupIndex === -1) return;
        state.groups[groupIndex].channelId = channelId;
      }),
    ),

  setGroupMode: (mode: Group["mode"]) =>
    set(
      produce((state: AnimeStore) => {
        const groupIndex = state.groups.findIndex((g) => g.id === get().editableGroupId);
        if (groupIndex === -1) return;
        state.groups[groupIndex].mode = mode;
      }),
    ),

  startGroupTimer: (groupId: number) =>
    set(
      produce((state: AnimeStore) => {
        const progressId = state.progress.findIndex((p) => p.groupId === groupId);
        if (progressId !== -1) state.progress[progressId].progress = 0;
      }),
    ),

  resetGroupTimer: (groupId: number) =>
    set(
      produce((state: AnimeStore) => {
        const progressId = state.progress.findIndex((p) => p.groupId === groupId);
        if (progressId !== -1) state.progress[progressId].progress = null;
      }),
    ),

  handleGroupsProgresses: (deltaTime: number) =>
    set(
      produce((state: AnimeStore) => {
        for (const timers of state.progress) {
          const groupId = state.groups.findIndex((g) => g.id === timers.groupId);
          if (groupId === -1) throw new Error("Group not found for progress handling");

          if (timers.progress === null) {
            if (state.groups[groupId].mode === RepeatMode.OFF) continue;
            timers.progress = 0;
          }

          const newProgress = timers.progress + deltaTime / state.groups[groupId].duration;
          if (newProgress >= 1) {
            if (state.groups[groupId].mode === RepeatMode.FOREVER) timers.progress = mod(newProgress, 1);
            if (state.groups[groupId].mode === RepeatMode.OFF) timers.progress = null;
          }
        }
      }),
    ),
});
