import {ServiceStatus} from "./service-status";
import {ServiceBranch} from "./service-branch";

export interface BaseUserOutputDto {
  username: string;

  slug: string;

  branch: ServiceBranch;

  serviceStatus: ServiceStatus;

  isVerifiedMilitary: boolean;

  serviceEntryDate: string;

  serviceExitDate: string;

  lastLoginAt: string;

  imageUrl: string;
}
