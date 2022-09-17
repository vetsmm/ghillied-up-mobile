import {badWords} from "../../utils/bad-words";

export type CreateGhillieFormValidationResponse = {
  name: string|null;
  about: string|null;
  imageUrl: string|null;
  topicNames: string|null;
}

export const createGhillieFormValidator = (
  formData: {
    name: string;
    about: string;
    imageUrl: string;
    topicNames: Set<string>;
  }
): CreateGhillieFormValidationResponse => {
  const { name, about, imageUrl, topicNames } = formData;

  return {
    name: validateName(name),
    about: validateAbout(about),
    imageUrl: validateImageUrl(imageUrl),
    topicNames: validateTopicNames(topicNames)
  };
}

const isBadWord = (name: string): boolean => {
  // if the name string contains a bad word, return true
  return badWords.some(badWord => name.includes(badWord));
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

const validateImageUrl = (imageUrl: string): string|null => {
  if (imageUrl.length > 300) {
    return 'Image URL must be less than 300 characters long';
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

