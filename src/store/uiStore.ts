import { create } from "zustand/react";

export const tabs = ["control", "color", "effect", "address"] as const;
export type Tab = (typeof tabs)[number];

interface UIStore {
  tab: Tab;
  setTab: (tab: Tab) => void;
}

export const uiStore = create<UIStore>()((set) => ({
  tab: "control",
  setTab: (tab) => set({ tab }),
}));
