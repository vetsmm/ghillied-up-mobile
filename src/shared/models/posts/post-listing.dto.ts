import {PostGhillieMetaDto, PostUserMetaDto} from "./post-detail.dto";
import {PostStatus} from "./post-status";
import {ReactionType} from "../reactions/reaction-type";
import {LinkMeta} from '../open-graph/link-meta';

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
  linkMeta?: LinkMeta;
  isPinned: boolean;
}
