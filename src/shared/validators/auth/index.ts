import {loginFormValidator} from "./login-form.validator";
import {registerFormValidator} from "./register-form.validator";
import {
  validateBranch,
  validateEmail,
  validatePassword, validatePasswords,
  validateServiceStatus,
  validateUsername
} from "./validators";

const authValidators = {
  loginFormValidator,
  registerFormValidator,
  validateUsername,
  validateEmail,
  validatePasswords,
  validatePassword,
  validateBranch,
  validateServiceStatus
}

export default authValidators;
