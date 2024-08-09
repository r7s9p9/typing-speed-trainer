import { isNumeric } from "./number";

export function getRandomInt(min: number, max: number): number {
  if (!isNumeric(min) || !isNumeric(max)) {
    console.error("Min and max must be finite numbers");
    return NaN;
  }

  if (min === max) return min;

  if (min > max) {
    console.error("Min must be less or equal than max");
    return NaN;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
