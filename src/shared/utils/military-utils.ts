import {ServiceBranch, ServiceStatus} from "../models/users";

export const getMilitaryString = (branch: ServiceBranch, serviceStatus: ServiceStatus) => {
  return `${getServiceString(serviceStatus)}${getBranchString(branch)}`;
}

const getServiceString = (serviceStatus: ServiceStatus) => {
  switch (serviceStatus) {
    case ServiceStatus.ACTIVE_DUTY:
      return "An active duty ";
    case ServiceStatus.RESERVE:
      return "A reservist ";
    case ServiceStatus.VETERAN:
      return "A veteran ";
    case ServiceStatus.NATIONAL_GUARD:
      return "A national guard ";
    default:
      return "A civilian ";
  }
}

const getBranchString = (branch: ServiceBranch) => {
  switch (branch) {
    case ServiceBranch.ARMY_NATIONAL_GUARD:
    case ServiceBranch.ARMY:
      return "Soldier";
    case ServiceBranch.NAVY:
      return "Sailor";
    case ServiceBranch.AIR_NATIONAL_GUARD:
    case ServiceBranch.AIR_FORCE:
      return "Airman";
    case ServiceBranch.MARINES:
      return "Marine";
    case ServiceBranch.SPACE_FORCE:
      return "Guardian";
    default:
      return "with no services";
  }
}
