import {badWords} from "../utils/bad-words";

export const IsBadWord = (name: string): boolean => {
    // if the name string contains a bad word, return true, this is case insensitive
    return badWords.some((badWord) => name.toLowerCase().includes(badWord));
}
