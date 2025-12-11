import { Pc } from "@api/Transmitter";
import { create } from "zustand/react";

export const tabs = ["control", "color", "effect", "address"] as const;
export type Tab = (typeof tabs)[number];

interface GlobalStore {
  tab: Tab;
  setTab: (tab: Tab) => void;

  editChannel: Pc.Channel | null;
  setEditChannel: (channel: Pc.Channel | null) => void;
}

export const globalStore = create<GlobalStore>()((set) => ({
  tab: "control",
  setTab: (tab) => set({ tab }),

  editChannel: 0,
  setEditChannel: (channel) => set({ editChannel: channel }),
}));
