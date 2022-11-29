import {CommentStatus} from './comment-status';
import {PostUserMetaDto} from '../posts/post-detail.dto';
import {ReactionType} from '../reactions/reaction-type';

export interface ChildCommentDto {
    parentId?: string;
    id: string;
    content: string;
    status: CommentStatus;
    createdDate: string;
    updatedDate?: string;
    createdBy: PostUserMetaDto;
    edited: boolean;
    currentUserReaction: ReactionType;
    numberOfReactions: number;
}
