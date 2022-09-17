import {ServiceBranch} from "../models/users";

export const getServiceBranchSealPng = (serviceBranch: ServiceBranch): string => {
  switch (serviceBranch) {
    case ServiceBranch.AIR_FORCE:
      return "air-force.png";
    case ServiceBranch.ARMY:
      return "army.png";
    // case ServiceBranch.:
    //   return require('../assets/images/seals/coast-guard.png');
    case ServiceBranch.MARINES:
      return "marines.png";
    case ServiceBranch.NAVY:
      return "navy.png";
    case ServiceBranch.AIR_NATIONAL_GUARD:
      return "air-national-guard.png";
    case ServiceBranch.ARMY_NATIONAL_GUARD:
      return "army-national-guard.png";
    default:
      return "us-flag.png";
  }
}
