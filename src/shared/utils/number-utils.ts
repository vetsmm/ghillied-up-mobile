// convert numbers to more readable format
export const numberToReadableFormat = (number?: number) => {
  if (number === undefined || number === null) {
    return '';
  }

  if (number < 1000) {
    return number;
  }
  if (number < 1000000) {
    return `${(number / 1000).toFixed(1)}k`;
  }
  if (number < 1000000000) {
    return `${(number / 1000000).toFixed(1)}m`;
  }
  return `${(number / 1000000000).toFixed(1)}b`;
}
