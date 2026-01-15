import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type GradientSlice, gradientSlice } from "./gradientSlice";
import { type GroupSlice, groupSlice } from "./groupSlice";
import { type VisualSlice, visualSlice } from "./visualSlice";
import { CRGB } from "@api/Transmitter";

export type AnimeStore = {} & GroupSlice & VisualSlice & GradientSlice;

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

export const animeStore = createStore<AnimeStore>()(
  persist(
    (...args) => ({
      ...groupSlice(...args),
      ...visualSlice(...args),
      ...gradientSlice(...args),
    }),
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
