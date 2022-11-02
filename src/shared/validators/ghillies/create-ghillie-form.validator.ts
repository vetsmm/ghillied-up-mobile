import {badWords} from "../../utils/bad-words";
import {ImageInfo} from 'expo-image-picker';

export type CreateGhillieFormValidationResponse = {
  name: string|null;
  about: string|null;
  topicNames: string|null;
  ghillieLogo: string|null;
}

export const createGhillieFormValidator = (
  formData: {
    name: string;
    about: string;
    topicNames: Set<string>;
    ghillieLogo: ImageInfo|null;
  }
): CreateGhillieFormValidationResponse => {
  const { name, about, topicNames } = formData;

  return {
    name: validateName(name),
    about: validateAbout(about),
    topicNames: validateTopicNames(topicNames),
    ghillieLogo: validateLogo(formData.ghillieLogo),
  };
}

const isBadWord = (name: string): boolean => {
  // if the name string contains a bad word, return true
  return badWords.some(badWord => name.includes(badWord));
}

const validateLogo = (logo: ImageInfo|null): string|null => {
  if (logo === null) {
    return 'You must select a logo';
  }

  return null;
}

const validateName = (name: string): string|null => {
  if (name.length < 3) {
    return 'Name must be at least 3 characters long';
  }
  if (name.length > 50) {
    return 'Name must be less than 50 characters long';
  }

  if (isBadWord(name)) {
    return 'Name contains an inappropriate word';
  }
  return null;
}

const validateAbout = (about: string): string|null => {
  if (about.length > 400) {
    return 'About must be less than 400 characters long';
  }

  return null;
}

const validateTopicNames = (topicNames: Set<string>): string|null => {
  if (topicNames.size > 5) {
    return 'You can only select up to 5 topics';
  }

  for (const topicName of topicNames) {
    if (isBadWord(topicName)) {
      return 'Topic name contains an inappropriate word';
    }
  }

  return null;
}

