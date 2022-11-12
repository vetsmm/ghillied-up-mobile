import type {CustomMatcher} from '../custom-match';
import * as Linking from 'expo-linking';

export const GhilliedUpHashTagMatcher: CustomMatcher = {
  pattern: /#([a-zA-Z0-9_]+)/g,
  type: 'ghilliedup-hashtag',
  getLinkUrl: ([hashtag]) => {
    const strippedHashtag = hashtag.replace('#', '');
    return Linking.createURL(`hashtag/${strippedHashtag}`);
  },
}
