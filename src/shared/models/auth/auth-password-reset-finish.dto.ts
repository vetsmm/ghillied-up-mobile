export interface AuthPasswordResetFinishDto {
  email: string;
  resetKey: number;
  newPassword: string;
}
