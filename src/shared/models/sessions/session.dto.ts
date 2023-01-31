import {UserOutput} from "../users/user-output.dto";

export interface SessionDto {
    createdDate: string;

    id: string;

    ipAddress: string;

    token: string;

    updatedDate: string;

    userAgent: string | null;

    city: string | null;

    region: string | null;

    timezone: string | null;

    countryCode: string | null;

    browser: string | null;

    operatingSystem: string | null;

    userId: string;

    user: UserOutput;

    isCurrentSession: boolean;
}
