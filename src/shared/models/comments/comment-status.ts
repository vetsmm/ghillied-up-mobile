export const CommentStatus ={
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  REMOVED: 'REMOVED'
};

export type CommentStatus = (typeof CommentStatus)[keyof typeof CommentStatus]
