import EffectCard from "@components/Cards/EffectCard";
import { animeStore } from "@store/animeStore";
import { uiStore } from "@store/uiStore";
import { useCallback } from "react";
import { useStore } from "zustand";

export default function EffectSelect(props: { groupId: number; visualId: number }) {
  const setTab = useStore(uiStore, (state) => state.setTab);
  const setEditableVisualId = useStore(animeStore, (state) => state.setEditableVisualId);
  const effect = useStore(animeStore, (state) => {
    const group = state.groups.find((g) => g.id === props.groupId);
    const visual = group?.visuals.find((v) => v.id === props.visualId);
    const effect = visual?.effect;
    return effect === undefined ? null : effect;
  });

  const handleClick = useCallback(() => {
    setEditableVisualId(props.visualId);
    setTab("effect");
  }, [props.visualId, setEditableVisualId, setTab]);

  return <EffectCard effect={effect} onClick={handleClick} />;
}
