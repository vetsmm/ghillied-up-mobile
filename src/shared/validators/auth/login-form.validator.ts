import {validateUsername} from "./validators";

export const loginFormValidator = (
  formState: {
    username: string;
    password: string;
  },
): Map<string, string | undefined | null> => {
  const errors: Map<string, string | undefined | null> = new Map();
  const { username, password } = formState;

  const usernameError = validateUsername(username);
  errors.set("username", usernameError);

  if (!password) {
    errors.set("password", "Password is required");
  }

  return errors;
}
