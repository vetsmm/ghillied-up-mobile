const enumStyleToSentence = (str: string) => {
// change from upper snake case to title case sentence
  return str.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

const maskEmail = (email: string) => {
  const [first, last] = email.split('@');
  return `${first.substr(0, 1)}*****${last}`;
}

// trim a string to a certain length and add an ellipsis if it is longer than the length
const trimString = (str: string | null, length: number) => {
  if (str === null) {
    return '';
  }
  if (str.length > length) {
    return `${str.substr(0, length)}...`;
  }
  return str;
}

const mapStringToObjectKey = (str: string, values: object) => {
  const keys = Object.keys(values);
  const match = keys.find(key => key === str);
  return match ? values[match] : null;
}

const trimStringToMaxLength = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
        return `${str.substr(0, maxLength)}...`;
    }
    return str;
}

const stringUtils = {
  trimString,
  enumStyleToSentence,
  maskEmail,
  mapStringToObjectKey,
  trimStringToMaxLength
}

export default stringUtils;
