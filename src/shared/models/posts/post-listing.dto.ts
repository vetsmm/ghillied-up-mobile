import {PostGhillieMetaDto, PostUserMetaDto} from "./post-detail.dto";
import {PostStatus} from "./post-status";
import {ReactionType} from "../reactions/reaction-type";

export interface TagMetaDto {
  name: string;
}
export interface PostListingDto {
  id: string;
  uid: string;
  title: string;
  content: string;
  status: PostStatus;
  postedBy: PostUserMetaDto;
  createdDate: string;
  tags: TagMetaDto[];
  ghillie: PostGhillieMetaDto;
  numberOfComments: number;
  numberOfReactions: number;
  currentUserReaction: ReactionType | null;
  edited: boolean;
}
