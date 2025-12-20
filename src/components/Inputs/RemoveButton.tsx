export default function RemoveButton(props: { onClick?: () => void }) {
  return (
    <button
      className="rounded-2xl border-2 p-1 text-2xl font-extralight tracking-widest transition-all active:scale-95 active:shadow-md"
      onClick={props.onClick}
    >
      X
    </button>
  );
}
