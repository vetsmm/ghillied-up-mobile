import {GhillieStatus} from "./ghillie-status";
import {GhillieCategory} from "./ghillie-category";

export interface GhillieSearchCriteria {
    cursor?: string;
    take: number;
    name?: string;
    slug?: string;
    about?: string;
    status?: GhillieStatus;
    readonly?: boolean;
    topicIds?: Array<string>;
    category?: GhillieCategory;
}
