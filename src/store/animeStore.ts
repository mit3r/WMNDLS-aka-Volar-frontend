import { createStore } from "zustand";
import { type GradientSlice, gradientSlice } from "./gradientSlice";
import { type GroupSlice, groupSlice } from "./groupSlice";
import { type VisualSlice, visualSlice } from "./visualSlice";

export type AnimeStore = {} & GroupSlice & VisualSlice & GradientSlice;

export const animeStore = createStore<AnimeStore>((...args) => ({
  ...groupSlice(...args),
  ...visualSlice(...args),
  ...gradientSlice(...args),
}));
