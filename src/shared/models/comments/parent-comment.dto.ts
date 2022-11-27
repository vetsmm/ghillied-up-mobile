import {CommentStatus} from './comment-status';
import {PostUserMetaDto} from '../posts/post-detail.dto';
import {ReactionType} from '../reactions/reaction-type';
import {ChildCommentDto} from './child-comment.dto';

export interface ParentCommentDto {
    id: string;
    content: string;
    status: CommentStatus;
    createdDate: string;
    updatedDate: string;
    createdBy: PostUserMetaDto;
    edited: boolean;
    postId: string;
    commentReplyCount: number;
    currentUserReaction: ReactionType | null;
    numberOfReactions: number;
    latestChildComments: ChildCommentDto[];
}
