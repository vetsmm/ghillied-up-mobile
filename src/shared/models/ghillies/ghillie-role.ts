export const GhillieRole = {
  MEMBER: 'MEMBER',
  MODERATOR: 'MODERATOR',
  OWNER: 'OWNER'
};

export type GhillieRole = (typeof GhillieRole)[keyof typeof GhillieRole]
