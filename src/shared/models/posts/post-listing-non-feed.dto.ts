import {ServiceBranch, ServiceStatus} from "../users";
import {ReactionType} from "../reactions/reaction-type";
import {GhillieStatus} from "../ghillies/ghillie-status";
import {PostStatus} from "./post-status";

export interface PostNonFeedDto {

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

    currentUserReactionType: ReactionType | null;

    ghillieName: string;

    ghillieStatus: GhillieStatus;

    ghillieImageUrl: string | null;

    isPinned: boolean;
}
