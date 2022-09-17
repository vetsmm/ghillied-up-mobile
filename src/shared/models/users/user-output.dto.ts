import {BaseUserOutputDto} from "./base-user-output.dto";
import {UserAuthority} from "./user-authorities";

export interface UserOutput extends BaseUserOutputDto{

  id: string;

  username: string;

  firstName: string;

  lastName: string;

  authorities: UserAuthority[];

  email: string;

  activated: boolean;

  createdDate: string;

  updatedDate: string;
}
