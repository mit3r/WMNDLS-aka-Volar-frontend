export default function DurationInput(props: {
  onChange: (value: number) => void;
  value: number;
  min?: number;
  max?: number;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    props.onChange(newValue);
  };

  return (
    <input
      type="number"
      value={props.value}
      onChange={handleChange}
      min={props.min}
      max={props.max}
      className="rounded border border-gray-600 bg-gray-800 p-1 text-white"
    />
  );
}
