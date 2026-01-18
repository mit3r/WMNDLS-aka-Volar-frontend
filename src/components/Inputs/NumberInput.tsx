import { useId, useRef } from "react";
import type { ChangeEvent } from "react";

export default function NumberInput(props: {
  title: string;
  helpText?: string;
  value?: number;
  onChange?: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  const id = useId();
  const helpId = `${id}-help`;
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw.trim() === "") return;

    const newValue = Number(raw);
    if (Number.isFinite(newValue) && props.onChange) props.onChange(newValue);
  };

  return (
    <div className="grid h-full w-full grid-rows-2 place-items-center rounded-2xl border-4 border-white bg-white">
      <div className="w-full">
        <label
          htmlFor={id}
          aria-label={props.title}
          className="block w-full overflow-hidden text-center text-xs font-bold text-ellipsis whitespace-nowrap text-black"
          title={props.title}
        >
          {props.title}
        </label>

        {props.helpText ? (
          <p
            id={helpId}
            className="mt-0.5 w-full px-1 text-center text-[10px] leading-3 text-gray-700"
          >
            {props.helpText}
          </p>
        ) : null}
      </div>
      <input
        id={id}
        ref={ref}
        type="number"
        min={props.min ?? 0}
        max={props.max}
        step={props.step ?? 0.1}
        value={props.value}
        onChange={handleChange}
        aria-describedby={props.helpText ? helpId : undefined}
        className="h-full w-full rounded-b-2xl border-gray-400 bg-gray-800 p-1 text-center text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
