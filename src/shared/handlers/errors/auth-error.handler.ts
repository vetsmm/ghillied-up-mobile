import {BaseApiException} from "../../models/exceptions/base-api.exception";

type FormErrors = {
  email: string | null;
  username: string | null;
  branch: string | null;
  serviceStatus: string | null;
  password: string | null;
  confirmPassword: string | null;
}

const handleRegisterError = (error: BaseApiException): FormErrors => {
  const errorContext: FormErrors = {
    email: null,
    username: null,
    branch: null,
    serviceStatus: null,
    password: null,
    confirmPassword: null,
  };

  Object.keys(error.context).forEach((key) => {
    errorContext[key] = error.context[key];
  });
  return errorContext;
}

const authErrorHandler = {
  handleRegisterError
}

export default authErrorHandler;
