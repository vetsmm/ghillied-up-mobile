import {ServiceBranch, ServiceStatus} from "../../models/users";

export const validateUsername = (username: string): string | null => {
  if (!username) {
    return "Username is required";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }
  if (username.length > 20) {
    return "Username must be less than 20 characters long";
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return "Username must only contain letters and numbers";
  }
  return null;
}

export const validateEmail = (email: string): string | null => {
  if (!email || email === "") {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email address";
  }
  return null;
}

export const validatePasswords = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) {
    return "Passwords must match";
  }
  return null;
}

export const validatePassword = (password: string): string | null => {
  if (!password || password === "") {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (password.length > 25) {
    return "Password must be less than 25 characters long";
  }
  return null;
}

export const validateBranch = (branch: ServiceBranch): string | null => {
  if (!branch) {
    return "Branch is required";
  }
  return null;
}

export const validateServiceStatus = (serviceStatus: ServiceStatus): string | null => {
  if (!serviceStatus) {
    return "Service Status is required";
  }
  return null;
}
