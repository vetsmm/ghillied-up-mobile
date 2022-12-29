import {GhillieCategory} from "./ghillie-category";

export interface UpdateGhillieDto {
  name?: string;
  about?: string | null;
  readOnly?: boolean;
  isPrivate?: boolean;
  adminInviteOnly?: boolean;
  category?: GhillieCategory
  topicNames?: string[];
}
