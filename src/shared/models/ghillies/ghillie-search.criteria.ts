import {GhillieStatus} from "./ghillie-status";
import {PaginationParamsDto} from "../pagination/types";

export interface GhillieSearchCriteria {
    cursor?: string;
    take: number;
    name?: string;
    slug?: string;
    about?: string;
    status?: GhillieStatus;
    readonly?: boolean;
    topicIds?: Array<string>;
}
