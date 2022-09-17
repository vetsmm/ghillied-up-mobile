import {ReactionType} from "../reactions/reaction-type";
import {CommentDetailDto} from "./comment-detail.dto";

export interface CommentReactionSubsetDto {
    reactions: {
        [key in ReactionType]: number;
    };
    totalReactions: number;
    comment?: CommentDetailDto;
    commentId?: string;
}
