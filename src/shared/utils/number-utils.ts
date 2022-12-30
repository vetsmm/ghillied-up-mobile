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

export const numberToReadableFormatRange = (number?: number) => {
    if (number === undefined || number === null) {
        return "0-50";
    }
    if (number < 50) {
        return "0-50";
    }
    if (number < 100) {
        return '50-100';
    }
    if (number < 500) {
        return '100-500';
    }
    if (number < 1000) {
        return '500-1000';
    }
    if (number < 5000) {
        return '1000-5000';
    }
    return '5000+';
}
