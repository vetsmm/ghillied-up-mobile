import {UserAuthority} from "../users";

export interface RegisterOutput {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  slug: string;
  authorities: UserAuthority[];
  email: string;
  activated: boolean;
  createdDate: string;
  updatedDate: string;
}
