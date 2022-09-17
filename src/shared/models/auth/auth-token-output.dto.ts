import {UserAuthority} from "../users";

export interface AuthTokenOutput {
  accessToken: string;
  refreshToken: string;
}

export interface UserAccessTokenClaims {
  id: string;
  username: string;
  authorities: UserAuthority[];
}

export interface UserRefreshTokenClaims {
  id: number;
}
