import {MfaMethod} from "../users/mfa-method";

export interface MfaTokenPayload {
    id: string;
    type: MfaMethod;
}
