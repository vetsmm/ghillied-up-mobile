export const FlagCategory = {
  HARRASSMENT: 'HARRASSMENT',
  RACISM: 'RACISM',
  OPSEC: 'OPSEC',
  SPAM: 'SPAM',
  OTHER: 'OTHER'
};

export type FlagCategory = (typeof FlagCategory)[keyof typeof FlagCategory]
