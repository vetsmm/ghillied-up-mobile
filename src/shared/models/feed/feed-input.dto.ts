import {FeedFilters} from "./feed.filter";

export class FeedInputDto {
    cursor?: string;
    take?: number = 25;
    filters?: FeedFilters;
    orderBy?: "asc" | "desc" = "desc";
}
