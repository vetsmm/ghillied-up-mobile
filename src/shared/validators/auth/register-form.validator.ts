import {ServiceBranch, ServiceStatus} from "../../models/users";
import {
  validateBranch,
  validateEmail,
  validatePassword,
  validatePasswords,
  validateServiceStatus,
  validateUsername
} from "./validators";

export type FormValidationResponse = {
  email: string|null;
  username: string|null;
  branch: string|null;
  serviceStatus: string|null;
  password: string|null;
  confirmPassword: string|null;
}

export const registerFormValidator = (
  formState: {
    email: string;
    username: string;
    branch: ServiceBranch;
    serviceStatus: ServiceStatus;
    password: string;
    confirmPassword: string;
  },
): FormValidationResponse => {
  const { email, username, branch, serviceStatus, password, confirmPassword } = formState;

  return {
    email: validateEmail(email),
    username: validateUsername(username),
    password: validatePassword(password),
    confirmPassword: validatePasswords(password, confirmPassword),
    branch: validateBranch(branch),
    serviceStatus: validateServiceStatus(serviceStatus)
  };
}
