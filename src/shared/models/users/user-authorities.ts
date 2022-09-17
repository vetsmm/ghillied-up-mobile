 const UserAuthority = {
  ROLE_USER: 'ROLE_USER',
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_MODERATOR: 'ROLE_MODERATOR',
  ROLE_VERIFIED_MILITARY: 'ROLE_VERIFIED_MILITARY'
};

export type UserAuthority = (typeof UserAuthority)[keyof typeof UserAuthority]
