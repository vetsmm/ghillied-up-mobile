// export interface GhillieDetailDto {
//
//     id: string;
//
//     name: string;
//
//     slug: string;
//
//     about: string | null;
//
//     readOnly: boolean;
//
//     imageUrl: string | null;
//
//     topics: TopicLiteOutputDto[];
//
//     ownerUsername?: string;
//
//     status: GhillieStatus;
//
//     createdAt: Date;
//
//     updatedAt: Date;
//
//     totalMembers?: number;
//
//     postCount?: number;
//
//     lastPostDate?: Date;
//
//     memberMeta?: GhillieMemberDto | null;
//
//     adminInviteOnly?: boolean;
//
//     isPrivate?: boolean;
//
//
//     category?: GhillieCategory;
//
//     inviteCode?: string;
// }
//
import {GhillieDetailDto} from "./ghillie-detail.dto";

export interface CombinedGhilliesDto {
    users: GhillieDetailDto[];

    popularByMembers: GhillieDetailDto[];

    popularByTrending: GhillieDetailDto[];

    newest: GhillieDetailDto[];

    internal: GhillieDetailDto[];

    promoted: GhillieDetailDto[];

    sponsored: GhillieDetailDto[];
}
