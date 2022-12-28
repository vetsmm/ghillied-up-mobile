import {TopicLiteOutputDto} from "../topic/topic-lite-output.dto";
import {GhillieStatus} from "./ghillie-status";
import {GhillieMemberDto} from "./ghillie-member.dto";
import {GhillieCategory} from "./ghillie-category";

export interface GhillieDetailDto {
  id: string;
  name: string;
  slug: string;
  about: string | null;
  readOnly: boolean;
  imageUrl: string | null;
  topics: TopicLiteOutputDto[];
  ownerUsername?: string;
  status: GhillieStatus
  createdAt: Date;
  updatedAt: Date;
  lastPostDate?: string;
  totalMembers?: number;
  memberMeta?: GhillieMemberDto | null;
  adminInviteOnly?: boolean;
  isPrivate?: boolean;
  category?: GhillieCategory;
  inviteCode?: string;
  postCount?: number;
}
