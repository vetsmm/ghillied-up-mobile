export const PostStatus = {
  ACTIVE: 'ACTIVE',
  HIDDEN: 'HIDDEN',
  REMOVED: 'REMOVED',
  ARCHIVED: 'ARCHIVED'
};

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus]
