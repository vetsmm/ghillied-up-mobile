import {CommentStatus} from "./comment-status";


export interface UpdateCommentDto {
  content?: string;
  status?: CommentStatus;
}
