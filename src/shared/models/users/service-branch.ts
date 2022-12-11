export enum ServiceBranch {
    ARMY = 'ARMY',
    ARMY_NATIONAL_GUARD = 'ARMY_NATIONAL_GUARD',
    AIR_FORCE = 'AIR_FORCE',
    AIR_NATIONAL_GUARD = 'AIR_NATIONAL_GUARD',
    MARINES = 'MARINES',
    NAVY = 'NAVY',
    SPACE_FORCE = 'SPACE_FORCE',
    UNKNOWN = 'UNKNOWN',
    COAST_GUARD = 'COAST_GUARD',
    NO_SERVICE = 'NO_SERVICE'
}

export const stringToServiceBranch = (str: string): ServiceBranch => {
    switch (str) {
        case 'ARMY':
            return ServiceBranch.ARMY;
        case 'ARMY_NATIONAL_GUARD':
            return ServiceBranch.ARMY_NATIONAL_GUARD;
        case 'AIR_FORCE':
            return ServiceBranch.AIR_FORCE;
        case 'AIR_NATIONAL_GUARD':
            return ServiceBranch.AIR_NATIONAL_GUARD;
        case 'MARINES':
            return ServiceBranch.MARINES;
        case 'NAVY':
            return ServiceBranch.NAVY;
        case 'SPACE_FORCE':
            return ServiceBranch.SPACE_FORCE;
        case 'COAST_GUARD':
            return ServiceBranch.COAST_GUARD;
        case 'UNKNOWN':
            return ServiceBranch.UNKNOWN;
        case 'NO_SERVICE':
            return ServiceBranch.NO_SERVICE;
        default:
            return ServiceBranch.UNKNOWN;
    }
}
