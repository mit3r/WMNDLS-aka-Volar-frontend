import { useId, useRef } from "react";

export default function NumberInput(props: {
  title: string;
  value?: number;
  onChange?: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDelay = parseFloat(e.target.value);
    if (!isNaN(newDelay) && props.onChange) props.onChange(newDelay);
  };

  return (
    <div className="grid h-full w-full grid-rows-2 place-items-center rounded-2xl border-4 border-white bg-white">
      <label
        htmlFor={id}
        aria-label={props.title}
        className="w-full overflow-hidden text-center text-xs font-bold text-ellipsis whitespace-nowrap text-black"
      >
        {props.title}
      </label>
      <input
        id={id}
        ref={ref}
        type="number"
        min={props.min || 0}
        step={props.step || 0.1}
        value={props.value}
        onChange={handleChange}
        className="h-full w-full rounded-b-2xl border-gray-400 bg-gray-800 p-1 text-center text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
