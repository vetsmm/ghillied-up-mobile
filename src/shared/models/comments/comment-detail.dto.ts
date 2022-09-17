import {CommentStatus} from "./comment-status";
import {PostUserMetaDto} from "../posts/post-detail.dto";

export interface CommentDetailDto {
  id: string;
  content: string;
  status: CommentStatus;
  createdDate: string;
  updatedDate: string;
  edited: boolean;
  createdBy: PostUserMetaDto;
  postId: string;
  commentHeight: number;
  childCommentIds: string[];
  numberOfChildComments: number;
  likedByCurrentUser: boolean;
  numberOfReactions: number;
}
