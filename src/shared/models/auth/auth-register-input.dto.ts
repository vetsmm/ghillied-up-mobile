import {ServiceBranch, ServiceStatus} from "../users";

export interface AuthRegisterInputDto {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  username: string;
  serviceEntryDate?: Date;
  serviceExitDate?: Date;
  branch?: ServiceBranch;
  serviceStatus?: ServiceStatus;
}
