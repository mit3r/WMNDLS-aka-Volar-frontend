import { ChainingMode, type Visual } from "@hooks/useAnimator/types/visuals";
import { produce } from "immer";
import type { StateCreator } from "zustand";
import type { AnimeStore } from "./animeStore";
import { CRGB } from "@api/Transmitter";
import { EffectType } from "@hooks/useAnimator/types/effects";

export interface VisualSlice {
  // Currently editable visual
  editableVisualId: number | null;
  setEditableVisualId: (visualId: number | null) => void;

  // Handling visuals order within a group
  getVisualsOrder: () => number[];
  setVisualsOrder: (newOrder: number[]) => void;

  // add/remove visuals order across groups
  addVisual: () => void;
  removeVisual: (groupId: number, visualId: number) => void;

  // Modifying visual properties
  setVisualChainingMode: (chaining: Visual["chaining"]) => void;
  setVisualDelay: (delay: number) => void;
  setVisualDuration: (duration: number) => void;
  setVisualEffect: (effect: Visual["effect"]) => void;
}

let visualIndexer = 1;

export const visualSlice: StateCreator<AnimeStore, [], [], VisualSlice> = (set, get) => ({
  editableVisualId: null,
  setEditableVisualId: (visualId) => set({ editableVisualId: visualId }),

  getVisualsOrder: () => get().groups.flatMap((group) => group.visuals.map((visual) => visual.id)),

  setVisualsOrder: (newOrder: number[]) =>
    set(
      produce((state: AnimeStore) => {
        const groupAtId = state.groups.findIndex((g) => g.id === state.editableGroupId);
        if (groupAtId === -1) throw new Error("Editable visual's group not found");

        state.groups[groupAtId].visuals = newOrder
          .map((id) => state.groups[groupAtId].visuals.find((visual) => visual.id === id))
          .filter((visual): visual is Visual => visual !== undefined);
      }),
    ),

  addVisual: () =>
    set(
      produce((state: AnimeStore) => {
        const groupId = state.groups.findIndex((g) => g.id === state.editableGroupId);
        if (groupId === -1) throw new Error("No group found to add visual to");
        const newVisualId = visualIndexer++;

        state.groups[groupId].visuals.push({
          id: newVisualId,
          chaining: ChainingMode.WHEN_LAST_ENDED,
          delay: 0,
          duration: 1,
          effect: EffectType.Solid,
          gradient: [{ id: 1, color: new CRGB(255, 255, 255) }],
        });
      }),
    ),

  removeVisual: (groupId, visualId) =>
    set(
      produce((state: AnimeStore) => {
        const groupIndex = state.groups.findIndex((g) => g.id === groupId);
        if (groupIndex === -1) throw new Error("No group found containing the visual to remove");
        state.groups[groupIndex].visuals = state.groups[groupIndex].visuals.filter((v) => v.id !== visualId);
        state.editableVisualId = null;
      }),
    ),

  setVisualChainingMode: (chaining) =>
    set(
      produce((state: AnimeStore) => {
        const groupId = state.groups.findIndex((g) => g.visuals.some((v) => v.id === get().editableVisualId));
        if (groupId === -1) return;
        const visualIndex = state.groups[groupId].visuals.findIndex((v) => v.id === get().editableVisualId);
        if (visualIndex === -1) return;
        state.groups[groupId].visuals[visualIndex].chaining = chaining;
      }),
    ),

  setVisualDelay: (delay) =>
    set(
      produce((state: AnimeStore) => {
        const groupId = state.groups.findIndex((g) => g.visuals.some((v) => v.id === get().editableVisualId));
        if (groupId === -1) return;
        const visualIndex = state.groups[groupId].visuals.findIndex((v) => v.id === get().editableVisualId);
        if (visualIndex === -1) return;
        state.groups[groupId].visuals[visualIndex].delay = delay;
      }),
    ),
  setVisualDuration: (duration) =>
    set(
      produce((state: AnimeStore) => {
        const groupId = state.groups.findIndex((g) => g.visuals.some((v) => v.id === get().editableVisualId));
        if (groupId === -1) return;
        const visualIndex = state.groups[groupId].visuals.findIndex((v) => v.id === get().editableVisualId);
        if (visualIndex === -1) return;
        state.groups[groupId].visuals[visualIndex].duration = duration;
      }),
    ),
  setVisualEffect: (effect) =>
    set(
      produce((state: AnimeStore) => {
        const groupId = state.groups.findIndex((g) => g.visuals.some((v) => v.id === get().editableVisualId));
        if (groupId === -1) return;
        const visualIndex = state.groups[groupId].visuals.findIndex((v) => v.id === get().editableVisualId);
        if (visualIndex === -1) return;
        state.groups[groupId].visuals[visualIndex].effect = effect;
      }),
    ),
});
