import {PostStatus} from "../posts/post-status";
import {ServiceBranch, ServiceStatus} from "../users";
import {ReactionType} from "../reactions/reaction-type";
import {LinkMeta} from '../open-graph/link-meta';

export interface PostFeedDto {
    id: string;
    uid: string;
    title: string;
    content: string;
    status: PostStatus;
    ghillieId: string;
    postedById: string;
    createdDate: string;
    updatedDate: string;
    edited: boolean;
    activityId: string | null;
    ownerUsername: string;
    ownerBranch: ServiceBranch;
    ownerServiceStatus: ServiceStatus;
    ownerSlug: string;
    postCommentsCount: number;
    postReactionsCount: number;
    currentUserReactionId: string | null;
    currentUserReactionType: ReactionType | null;
    ghillieName: string;
    ghillieImageUrl: string | null;
    linkMeta?: LinkMeta | undefined;
}
