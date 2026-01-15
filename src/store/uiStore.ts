import { create } from "zustand/react";
import { createJSONStorage, persist } from "zustand/middleware";

export const tabs = ["control", "color", "effect", "address"] as const;
export type Tab = (typeof tabs)[number];

interface UIStore {
  tab: Tab;
  setTab: (tab: Tab) => void;

  recentColors: string[];
  pushRecentColor: (hex: string) => void;
}

const UI_STORE_KEY = "volar:uiStore";

export const uiStore = create<UIStore>()(
  persist(
    (set) => ({
      tab: "control",
      setTab: (tab) => set({ tab }),

      recentColors: [],
      pushRecentColor: (hex) =>
        set((state) => {
          const normalized = hex.startsWith("#") ? hex.toLowerCase() : `#${hex.toLowerCase()}`;
          const deduped = state.recentColors.filter((c) => c !== normalized);
          return { recentColors: [normalized, ...deduped].slice(0, 4) };
        }),
    }),
    {
      name: UI_STORE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tab: state.tab,
        recentColors: state.recentColors,
      }),
    },
  ),
);
