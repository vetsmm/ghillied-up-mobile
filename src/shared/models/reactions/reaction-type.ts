export const ReactionType = {
  THUMBS_UP: 'THUMBS_UP',
  LAUGH: 'LAUGH',
  SMART: 'SMART',
  CURIOUS: 'CURIOUS',
  ANGRY: 'ANGRY'
};

export type ReactionType = (typeof ReactionType)[keyof typeof ReactionType]
