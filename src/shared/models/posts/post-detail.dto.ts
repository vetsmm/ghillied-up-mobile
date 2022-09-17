import {ServiceBranch, ServiceStatus} from "../users";
import {PostStatus} from "./post-status";
import {ReactionType} from "../reactions/reaction-type";

export interface PostGhillieMetaDto {
  id: string;
  name: string;
  imageUrl: string;
}

export interface PostUserMetaDto {
  username: string;
  branch: ServiceBranch;
  serviceStatus: ServiceStatus;
  slug: string;
}

export interface PostDetailDto {
  id: string;
  uid: string;
  title: string;
  content: string;
  status: PostStatus;
  ghillie: PostGhillieMetaDto;
  postedBy: PostUserMetaDto;
  createdDate: string;
  updatedDate: string;
  tags: string[];
  numberOfComments: number;
  numberOfReactions: number;
  currentUserReaction: ReactionType;
  edited: boolean;
}
