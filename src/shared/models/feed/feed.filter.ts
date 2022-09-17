import {PostStatus} from "../posts/post-status";
import {Enumerable, StringFilter} from "../filters";
import {DateTimeFilter} from "../filters/date-time-filter";

export class NestedEnumPostStatusFilter {
    equals?: PostStatus
    in?: Enumerable<PostStatus>
    notIn?: Enumerable<PostStatus>
    not?: NestedEnumPostStatusFilter | PostStatus
}

export class PostStatusFilter {
    equals?: PostStatus
    in?: Enumerable<PostStatus>
    notIn?: Enumerable<PostStatus>
    not?: NestedEnumPostStatusFilter | PostStatus
}

export class FeedFilters {
    id?: StringFilter | string;
    uid?: StringFilter | string;
    title?: StringFilter | string
    content?: StringFilter | string
    ghillieId?: StringFilter | string
    postedById?: StringFilter | string
    status?: PostStatusFilter | PostStatus
    createdDate?: DateTimeFilter | Date | string
    updatedDate?: DateTimeFilter | Date | string
}
