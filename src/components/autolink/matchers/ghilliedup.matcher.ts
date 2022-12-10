import type {CustomMatcher} from '../custom-match';
import {navigate} from '../../../navigation/nav-ref';

export const GhilliedUpHashTagMatcher: CustomMatcher = {
  pattern: /#([a-zA-Z0-9_]+)/g,
  type: 'ghilliedup-hashtag',
  onPress: (match) => {
    navigate('Feed', {
      screen: "HashTagFeed",
      params: {
        hashtag: match.getReplacerArgs()[0].replace('#', '')
      }
    });
  }
}
