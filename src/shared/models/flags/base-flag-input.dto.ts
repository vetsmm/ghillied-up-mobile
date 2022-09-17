import {FlagCategory} from "./flag-category";

export interface BaseFlagInputDto {
  details?: string;
  flagCategory: FlagCategory;
}
