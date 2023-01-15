import {MemberStatus} from "../members/member-status";
import {GhillieRole} from "./ghillie-role";

export interface GhillieMemberDto {
  ghillieId: string;
  userId: string;
  joinDate: Date;
  memberStatus: MemberStatus;
  role: GhillieRole;
  newPostNotifications: boolean;
}
