import { CRGB } from "@api/Transmitter";

export type Stop = {
  id: number;
  color: CRGB;
};

export type Gradient = Stop[];

/**
 * @param ledOffset position from 0 to 1
 * @param gradient list of color stops
 */
export function getColorFromGradient(ledOffset: number, gradient: Gradient): CRGB {
  if (gradient.length === 0) throw new Error("Gradient has no stops");

  if (gradient.length === 1) return gradient[0].color;

  if (ledOffset <= 0) return gradient[gradient.length - 1].color;
  if (ledOffset >= 1) return gradient[0].color;

  const scaledPosition = ledOffset * (gradient.length - 1);
  const index = Math.floor(scaledPosition);
  const t = scaledPosition - index;

  const startColor = gradient[index + 1].color;
  const endColor = gradient[index].color;

  return new CRGB(
    Math.round(startColor.red + (endColor.red - startColor.red) * t),
    Math.round(startColor.green + (endColor.green - startColor.green) * t),
    Math.round(startColor.blue + (endColor.blue - startColor.blue) * t),
  );
}
