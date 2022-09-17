import { ReactionType } from "../reactions/reaction-type";
import {PostDetailDto} from "./post-detail.dto";

export interface PostReactionSubsetDto {
    reactions: {
        [key in ReactionType]: number;
    };
    totalReactions: number;
    post?: PostDetailDto;
    postId?: string;
}
