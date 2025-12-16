import { CRGB } from "@api/Transmitter";
import type { Gradient } from "@hooks/useAnimator/gradients";
import type { StateCreator } from "zustand";
import type { AnimeStore } from "./animeStore";
import { produce } from "immer";

export interface GradientSlice {
  setGradient: (gradient: Gradient) => void;
  getEditableGradient: () => Gradient | null;

  addGradientStop: () => void;
  removeGradientStop: (id: number) => void;
  updateGradientStop: (id: number, color: CRGB) => void;
}

export const gradientSlice: StateCreator<AnimeStore, [], [], GradientSlice> = (set, get) => ({
  setGradient: (gradient) =>
    set(
      produce((state: AnimeStore) => {
        if (state.editableGroupId === null) return;
        if (state.editableVisualId === null) return;

        const groupIndex = state.groups.findIndex((g) => g.id === state.editableGroupId);
        if (groupIndex === -1) throw new Error("Editable group not found");
        const visualIndex = state.groups[groupIndex].visuals.findIndex((v) => v.id === state.editableVisualId);
        if (visualIndex === -1) throw new Error("Editable visual not found");
        state.groups[groupIndex].visuals[visualIndex].gradient = gradient;
      }),
    ),

  getEditableGradient: () => {
    const state = get();
    if (state.editableGroupId === null) return null;
    if (state.editableVisualId === null) return null;
    const group = state.groups.find((g) => g.id === state.editableGroupId);
    if (!group) return null;
    const visual = group.visuals.find((v) => v.id === state.editableVisualId);
    if (!visual) return null;
    return visual.gradient;
  },

  addGradientStop: () =>
    set(
      produce((state: AnimeStore) => {
        if (state.editableGroupId === null) return;
        if (state.editableVisualId === null) return;

        const groupIndex = state.groups.findIndex((g) => g.id === state.editableGroupId);
        if (groupIndex === -1) throw new Error("Editable group not found");
        const visualIndex = state.groups[groupIndex].visuals.findIndex((v) => v.id === state.editableVisualId);
        if (visualIndex === -1) throw new Error("Editable visual not found");
        const gradient = state.groups[groupIndex].visuals[visualIndex].gradient;

        const newId = gradient.length > 0 ? Math.max(...gradient.map((s) => s.id)) + 1 : 1;
        state.groups[groupIndex].visuals[visualIndex].gradient.push({ id: newId, color: new CRGB(255, 255, 255) });
      }),
    ),

  removeGradientStop: (id) =>
    set(
      produce((state: AnimeStore) => {
        if (state.editableGroupId === null) return;
        if (state.editableVisualId === null) return;

        const groupIndex = state.groups.findIndex((g) => g.id === state.editableGroupId);
        if (groupIndex === -1) throw new Error("Editable group not found");
        const visualIndex = state.groups[groupIndex].visuals.findIndex((v) => v.id === state.editableVisualId);
        if (visualIndex === -1) throw new Error("Editable visual not found");

        const gradient = state.groups[groupIndex].visuals[visualIndex].gradient;
        state.groups[groupIndex].visuals[visualIndex].gradient = gradient.filter((stop) => stop.id !== id);
      }),
    ),

  updateGradientStop: (id, color) =>
    set(
      produce((state: AnimeStore) => {
        if (state.editableGroupId === null) return;
        if (state.editableVisualId === null) return;

        const groupIndex = state.groups.findIndex((g) => g.id === state.editableGroupId);
        if (groupIndex === -1) throw new Error("Editable group not found");
        const visualIndex = state.groups[groupIndex].visuals.findIndex((v) => v.id === state.editableVisualId);
        if (visualIndex === -1) throw new Error("Editable visual not found");

        const gradient = state.groups[groupIndex].visuals[visualIndex].gradient;
        const stopIndex = gradient.findIndex((stop) => stop.id === id);
        if (stopIndex === -1) return;
        state.groups[groupIndex].visuals[visualIndex].gradient[stopIndex].color = color;
      }),
    ),
});
