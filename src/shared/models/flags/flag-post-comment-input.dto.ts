import {BaseFlagInputDto} from "./base-flag-input.dto";

export interface FlagPostCommentInputDto extends BaseFlagInputDto {
  commentId: string;
}
