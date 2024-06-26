import {UserAuthority} from "../users";
import {MfaMethod} from "../users/mfa-method";

export interface AuthTokenOutput {
  accessToken: string;
  refreshToken: string;
}

export function isInstanceOfTokenOutput(object: any): boolean {
  return "accessToken" in object;
}


export interface UserAccessTokenClaims {
  id: string;
  username: string;
  authorities: UserAuthority[];
}

export interface UserRefreshTokenClaims {
  id: number;
}

export interface TotpTokenResponse {
  totpToken: string;
  type: MfaMethod;
  multiFactorRequired: true;
}

export function isInstanceOfTotpTokenResponse(object: any): boolean {
  return "multiFactorRequired" in object;
}
