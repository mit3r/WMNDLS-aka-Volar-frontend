import { Pc } from "@api/Transmitter";
import type { Group, GroupId } from "@hooks/useAnimator/types/groups";
import { RepeatMode } from "@hooks/useAnimator/types/visuals";
import { produce } from "immer";
import type { StateCreator } from "zustand";
import type { AnimeStore } from "./animeStore";

export interface GroupSlice {
  groups: Group[];

  // adding/removing groups
  addGroup: () => void;
  removeGroup: (groupId: GroupId) => void;

  // Handling groups order
  // setGroups: (newGroups: Group[]) => void;
  getGroupOrder: () => GroupId[];
  setGroupOrder: (order: GroupId[]) => void;

  // Currently editable group
  editableGroupId: GroupId | null;
  setEditableGroupId: (groupId: GroupId | null) => void;

  // Modifying group properties
  setGroupChannel: (groupId: GroupId, channelId: Group["channelId"]) => void;
  setGroupMode: (groupId: GroupId, mode: Group["mode"]) => void;
  setGroupDelay: (groupId: GroupId, delay: number) => void;
}

let groupIndexer = 1;

export const groupSlice: StateCreator<AnimeStore, [], [], GroupSlice> = (set, get) => ({
  groups: [],

  addGroup: () =>
    set(
      produce((state: AnimeStore) => {
        const groupId = groupIndexer++;

        state.groups.push({
          id: groupId,
          channelId: Pc.BROADCAST_CHANNEL,
          mode: RepeatMode.STOP,
          visuals: [],
          delay: 0,
        });
      }),
    ),

  removeGroup: (groupId: number) =>
    set(
      produce((state: AnimeStore) => {
        state.groups = state.groups.filter((group) => group.id !== groupId);
        state.editableGroupId = state.editableGroupId === groupId ? null : state.editableGroupId;
      }),
    ),

  getGroupOrder: () => get().groups.map((g) => g.id),

  setGroupOrder: (order: GroupId[]) =>
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

  setEditableGroupId: (groupId: GroupId | null) =>
    set(
      produce((state: AnimeStore) => {
        state.editableGroupId = groupId;
      }),
    ),

  setGroupChannel: (groupId: GroupId, channelId: Group["channelId"]) =>
    set(
      produce((state: AnimeStore) => {
        const groupIndex = state.groups.findIndex((g) => g.id === groupId);
        if (groupIndex === -1) return;
        state.groups[groupIndex].channelId = channelId;
      }),
    ),

  setGroupMode: (groupId: number, newMode: Group["mode"]) =>
    set(
      produce((state: AnimeStore) => {
        const GIndex = state.groups.findIndex((g) => g.id === groupId);
        if (GIndex === -1) return;
        if (state.groups[GIndex].mode === newMode) return;

        // In channel conflict, set other group's mode to STOP
        for (let anotherGIndex = 0; anotherGIndex < state.groups.length; anotherGIndex++) {
          if (anotherGIndex === GIndex) continue;

          const isBroadcastComparison =
            state.groups[anotherGIndex].channelId === Pc.BROADCAST_CHANNEL ||
            state.groups[GIndex].channelId === Pc.BROADCAST_CHANNEL;

          if (state.groups[anotherGIndex].channelId !== state.groups[GIndex].channelId && !isBroadcastComparison)
            continue;
          if (state.groups[anotherGIndex].mode !== RepeatMode.STOP) state.groups[anotherGIndex].mode = RepeatMode.STOP;
        }

        state.groups[GIndex].mode = newMode;
      }),
    ),

  setGroupDelay: (groupId: GroupId, delay: number) =>
    set(
      produce((state: AnimeStore) => {
        const groupIndex = state.groups.findIndex((g) => g.id === groupId);
        if (groupIndex === -1) return;
        state.groups[groupIndex].delay = delay;
      }),
    ),
});
