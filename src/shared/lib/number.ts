export function isNumeric(value: number) {
  if (!isFinite(value) || isNaN(+value)) return false;
  return true;
}

export function getNumber(value: string | number) {
  if (typeof value !== "number") return Number(value);
  return value;
}

export function getRandomBoolean(chance: number = 0.5): boolean {
  if (!isNumeric(chance) || chance < 0 || chance > 1) {
    console.error("Chance must be a finite number between 0 and 1");
    return false;
  }

  return Math.random() < chance;
}
