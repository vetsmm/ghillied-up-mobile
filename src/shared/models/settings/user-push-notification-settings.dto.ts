import {UserOutput} from "../users/user-output.dto";


export interface UserPushNotificationSettingsDto {
  createdDate: Date;
  updatedDate: Date;
  user: UserOutput;
  postReactions: boolean;
  postComments: boolean;
  commentReactions: boolean;
  postActivity: boolean;
}
