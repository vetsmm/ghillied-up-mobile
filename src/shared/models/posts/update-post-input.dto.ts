import {PostStatus} from "./post-status";

export interface UpdatePostInputDto {
  content?: string
  status?: PostStatus
}
