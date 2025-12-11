const rows = 9;
const cols = 9;
const colors = new Array(rows * cols).fill(0).map((_, i) => {
  const r = Math.floor(i / cols);
  const c = i % cols;

  const hue = Math.floor((c / cols) * 360);
  const lightness = Math.floor((r / rows) * 50) + 25;
  return `hsl(${hue}, 100%, ${lightness}%)`;
});

export default function Palete() {
  return (
    <div
      className="grid"
      style={{
        aspectRatio: `${cols} / ${rows}`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {colors.map((color, index) => (
        <div
          key={index}
          className="cursor-pointer hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
