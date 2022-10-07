import {loginFormValidator} from "./login-form.validator";
import {registerFormValidator} from "./register-form.validator";
import {
  validateBranch,
  validateEmail,
  validatePassword, validatePasswords,
  validateServiceStatus,
  validateUsername
} from "./validators";
import {updateFormValidator} from "./update-form.validator";

const validators = {
  loginFormValidator,
  registerFormValidator,
  updateFormValidator,
  validateUsername,
  validateEmail,
  validatePasswords,
  validatePassword,
  validateBranch,
  validateServiceStatus,
}

export default validators;
