export enum ServiceStatus {
  VETERAN= 'VETERAN',
  ACTIVE_DUTY= 'ACTIVE_DUTY',
  RESERVE= 'RESERVE',
  UNKNOWN= 'UNKNOWN',
  NATIONAL_GUARD= 'NATIONAL_GUARD',
  CIVILIAN= 'CIVILIAN'
};

export const stringToServiceStatus = (str: string): ServiceStatus => {
  switch (str) {
    case 'VETERAN':
      return ServiceStatus.VETERAN;
    case 'ACTIVE_DUTY':
      return ServiceStatus.ACTIVE_DUTY;
    case 'RESERVE':
      return ServiceStatus.RESERVE;
    case 'UNKNOWN':
      return ServiceStatus.UNKNOWN;
    case 'NATIONAL_GUARD':
      return ServiceStatus.NATIONAL_GUARD;
    case 'CIVILIAN':
      return ServiceStatus.CIVILIAN;
    default:
      return ServiceStatus.UNKNOWN;
  }
}
