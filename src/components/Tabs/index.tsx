import { globalStore, tabs, type Tab } from "@store/globalStore";
import mod from "@utils/mod";
import clsx from "clsx";
import { useCallback, useEffect, useMemo } from "react";
import { useStore } from "zustand";
import ControlTab from "./ControlTab";
import EffectTab from "./EffectTab";
import GradientTab from "./GradientTab";
import TabAddress from "./AddressTab";

export default function Tabs() {
  const tab = useStore(globalStore, (state) => state.tab);
  const setTab = useStore(globalStore, (state) => state.setTab);

  const TabComponent = useMemo(() => {
    switch (tab) {
      case "control":
        return <ControlTab />;
      case "color":
        return <GradientTab />;
      case "effect":
        return <EffectTab />;
      case "address":
        return <TabAddress />;
      default:
        return null;
    }
  }, [tab]);

  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-4 p-4">
      <TabsRadio tab={tab ?? "control"} onChange={(newTab) => setTab(newTab)} />
      {TabComponent}
    </div>
  );
}

function TabsRadio(props: { tab: Tab; onChange: (tab: Tab) => void }) {
  const handleMove = useCallback(
    (offset: number) => {
      const currentIndex = tabs.indexOf(props.tab);
      const index = mod(currentIndex + offset, tabs.length);
      props.onChange(tabs[index]);
    },
    [props],
  );

  const handleKeyboard = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "[") handleMove(-1);
      if (event.key === "]") handleMove(1);
    },
    [handleMove],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);
    return () => {
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [handleKeyboard]);

  return (
    <div className="grid h-full grid-flow-col-dense grid-cols-4 gap-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => props.onChange(tab)}
          className={clsx("corner-bevel rounded-tl-lg rounded-br-lg p-2 outline-0", {
            "bg-slate-600 text-white": props.tab !== tab,
            "bg-slate-300 text-black": props.tab === tab,
          })}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}
