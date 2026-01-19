import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type GradientSlice, gradientSlice } from "./gradientSlice";
import { type GroupSlice, groupSlice } from "./groupSlice";
import { type VisualSlice, visualSlice } from "./visualSlice";
import { CRGB } from "@api/Transmitter";

export interface HistorySlice {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export type AnimeStore = {} & GroupSlice & VisualSlice & GradientSlice & HistorySlice;

const ANIME_STORE_KEY = "volar:animeStore";

function reviveCRGB(input: unknown): CRGB {
  if (input instanceof CRGB) return input;
  if (!input || typeof input !== "object") return new CRGB(0, 0, 0);

  const obj = input as Record<string, unknown>;
  const r = (obj.r ?? obj.red ?? obj._red) as number | undefined;
  const g = (obj.g ?? obj.green ?? obj._green) as number | undefined;
  const b = (obj.b ?? obj.blue ?? obj._blue) as number | undefined;
  return new CRGB(typeof r === "number" ? r : 0, typeof g === "number" ? g : 0, typeof b === "number" ? b : 0);
}

type AnimeSnapshot = Pick<AnimeStore, "groups" | "editableGroupId" | "editableVisualId">;

function cloneSnapshot(snapshot: AnimeSnapshot): AnimeSnapshot {
  return {
    editableGroupId: snapshot.editableGroupId,
    editableVisualId: snapshot.editableVisualId,
    groups: snapshot.groups.map((group) => ({
      ...group,
      visuals: group.visuals.map((visual) => ({
        ...visual,
        gradient: visual.gradient.map((stop) => ({
          ...stop,
          color: new CRGB(stop.color.r, stop.color.g, stop.color.b),
        })),
      })),
    })),
  };
}

function pickSnapshot(state: AnimeStore): AnimeSnapshot {
  return {
    groups: state.groups,
    editableGroupId: state.editableGroupId,
    editableVisualId: state.editableVisualId,
  };
}

function comparableSnapshot(snapshot: AnimeSnapshot, includeMode: boolean) {
  return {
    editableGroupId: snapshot.editableGroupId,
    editableVisualId: snapshot.editableVisualId,
    groups: snapshot.groups.map((g) => ({
      id: g.id,
      channelId: g.channelId,
      delay: g.delay,
      ...(includeMode ? { mode: g.mode } : {}),
      visuals: g.visuals.map((v) => ({
        id: v.id,
        chaining: v.chaining,
        delay: v.delay,
        duration: v.duration,
        effect: v.effect,
        gradient: v.gradient.map((s) => ({
          id: s.id,
          color: { r: s.color.r, g: s.color.g, b: s.color.b },
        })),
      })),
    })),
  };
}

function snapshotsEqual(a: AnimeSnapshot, b: AnimeSnapshot) {
  return JSON.stringify(comparableSnapshot(a, true)) === JSON.stringify(comparableSnapshot(b, true));
}

function changedOnlyGroupModes(a: AnimeSnapshot, b: AnimeSnapshot) {
  if (a.editableGroupId !== b.editableGroupId) return false;
  if (a.editableVisualId !== b.editableVisualId) return false;
  if (a.groups.length !== b.groups.length) return false;
  const baseEqual = JSON.stringify(comparableSnapshot(a, false)) === JSON.stringify(comparableSnapshot(b, false));
  if (!baseEqual) return false;
  const modesA = a.groups.map((g) => ({ id: g.id, mode: g.mode }));
  const modesB = b.groups.map((g) => ({ id: g.id, mode: g.mode }));
  return JSON.stringify(modesA) !== JSON.stringify(modesB);
}

export const animeStore = createStore<AnimeStore>()(
  persist(
    (set, get, api) => {
      const historyPast: AnimeSnapshot[] = [];
      const historyFuture: AnimeSnapshot[] = [];
      let isTimeTraveling = false;

      const updateFlags = () => {
        set({ canUndo: historyPast.length > 0, canRedo: historyFuture.length > 0 }, false);
      };

      const trackedSet = (partial: unknown, replace?: boolean) => {
        const prev = pickSnapshot(get() as AnimeStore);
        if (replace === true) set(partial as never, true);
        else set(partial as never, false);
        if (isTimeTraveling) return;

        const next = pickSnapshot(get() as AnimeStore);
        if (snapshotsEqual(prev, next)) return;
        if (changedOnlyGroupModes(prev, next)) return;

        historyPast.push(cloneSnapshot(prev));
        if (historyPast.length > 100) historyPast.shift();
        historyFuture.length = 0;
        updateFlags();
      };


      return {
        ...groupSlice(trackedSet, get, api),
        ...visualSlice(trackedSet, get, api),
        ...gradientSlice(trackedSet, get, api),

        canUndo: false,
        canRedo: false,
        undo: () => {
          if (historyPast.length === 0) return;
          const current = cloneSnapshot(pickSnapshot(get() as AnimeStore));
          const previous = historyPast.pop()!;
          historyFuture.push(current);
          isTimeTraveling = true;
          set({ ...previous }, false);
          isTimeTraveling = false;
          updateFlags();
        },
        redo: () => {
          if (historyFuture.length === 0) return;
          const current = cloneSnapshot(pickSnapshot(get() as AnimeStore));
          const next = historyFuture.pop()!;
          historyPast.push(current);
          isTimeTraveling = true;
          set({ ...next }, false);
          isTimeTraveling = false;
          updateFlags();
        },
        clearHistory: () => {
          historyPast.length = 0;
          historyFuture.length = 0;
          updateFlags();
        },
      };
    },
    {
      name: ANIME_STORE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        groups: state.groups,
        editableGroupId: state.editableGroupId,
        editableVisualId: state.editableVisualId,
      }),
      merge: (persisted, current) => {
        const persistedState = (persisted as Partial<AnimeStore>) ?? {};
        const groups = (persistedState.groups ?? current.groups).map((group) => ({
          ...group,
          visuals: (group.visuals ?? []).map((visual) => ({
            ...visual,
            gradient: (visual.gradient ?? []).map((stop) => ({
              ...stop,
              color: reviveCRGB((stop as { color?: unknown }).color),
            })),
          })),
        }));

        return {
          ...current,
          ...persistedState,
          groups,
        } as AnimeStore;
      },
    },
  ),
);
