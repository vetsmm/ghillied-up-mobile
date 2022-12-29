import {GhillieCategory} from "./ghillie-category";

export interface CreateGhillieInputDto {
    name: string;
    about?: string | null;
    readOnly: boolean;
    topicNames?: string[] | null;
    adminInviteOnly: boolean;
    isPrivate: boolean;
    category: GhillieCategory;
}
