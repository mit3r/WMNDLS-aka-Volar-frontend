import { create } from "zustand/react";

export const tabs = ["control", "color", "effect"] as const;
export type Tab = (typeof tabs)[number];

interface UIStore {
  tab: Tab;
  setTab: (tab: Tab) => void;

  recentColors: string[];
  pushRecentColor: (hex: string) => void;
}

export const uiStore = create<UIStore>()((set) => ({
  tab: "control",
  setTab: (tab) => set({ tab }),

  recentColors: [],
  pushRecentColor: (hex) =>
    set((state) => {
      const normalized = hex.startsWith("#") ? hex.toLowerCase() : `#${hex.toLowerCase()}`;
      const deduped = state.recentColors.filter((c) => c !== normalized);
      return { recentColors: [normalized, ...deduped].slice(0, 4) };
    }),
}));
