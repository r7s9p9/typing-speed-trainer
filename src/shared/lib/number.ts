export function isNumeric(value: number) {
  if (!isFinite(value) || isNaN(+value)) return false;
  return true;
}

export function getNumber(value: string | number) {
  if (typeof value !== "number") return Number(value);
  return value;
}

export function formatNumber(number: number, digitsAfterPoint: number = 2) {
  return (Math.round(number * 100) / 100).toFixed(digitsAfterPoint);
}
