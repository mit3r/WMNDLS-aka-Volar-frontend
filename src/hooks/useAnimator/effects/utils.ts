export function star(x: number) {
  if (x < 0 || x > 1) return 0;
  return (x * Math.sin(Math.PI * x)) / 0.57923;
}
