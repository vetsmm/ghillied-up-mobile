import { axiosInstance } from './api'

import {AuthLoginInputDto} from "../models/auth/auth-login-input.dto";
import {AuthRegisterInputDto} from "../models/auth/auth-register-input.dto";
import {RegisterOutput} from "../models/auth/auth-register-output.dto";
import {AuthTokenOutput} from "../models/auth/auth-token-output.dto";
import AppConfig from "../../config/app.config";
import {AuthChangePasswordInputDto} from "../models/auth/auth-change-password-input.dto";
import {AuthPasswordResetInitDto} from "../models/auth/auth-password-reset-init.dto";
import {AuthPasswordResetFinishDto} from "../models/auth/auth-password-reset-finish.dto";
import {UserOutput} from "../models/users/user-output.dto";
import {AuthVerifyEmailInputDto} from "../models/auth/auth-verify-email-input.dto";
import {AuthResendVerifyEmailInputDto} from "../models/auth/auth-resend-verify-email-input.dto";
import {AuthPasswordResetVerifyKeyDto} from "../models/auth/auth-password-reset-verify-key.dto";
import {BaseApiResponse} from "../models/base-api-response";
import axios from "axios";

const login = async (loginInput: AuthLoginInputDto): Promise<BaseApiResponse<AuthTokenOutput, never>> => {
  return await axios.post(`${AppConfig.apiUrl}/auth/login`, loginInput)
    .then(res => {
        console.log(typeof res.data);
      return res.data;
    });
}

const register = async (registerInput: AuthRegisterInputDto): Promise<BaseApiResponse<RegisterOutput, never>> => {
  return await axiosInstance
    .post(`${AppConfig.apiUrl}/auth/register`, registerInput)
    .then(res => {
      return res.data
    });
}

const changePassword = async (changePasswordInput: AuthChangePasswordInputDto): Promise<void> => {
  return await axiosInstance
    .post(`${AppConfig.apiUrl}/auth/change-password`, changePasswordInput)
    .then(() => {
      return
    });
}

const resetPasswordInit = async (resetInit: AuthPasswordResetInitDto): Promise<BaseApiResponse<string, never>> => {
  return await axiosInstance
    .post(`${AppConfig.apiUrl}/auth/reset-password/init`, resetInit)
    .then((res) => {
      return res.data;
    });
}

const resetPasswordVerifyKey = async (verifyKeyDto: AuthPasswordResetVerifyKeyDto): Promise<any> => {
  return await axiosInstance
    .post(`${AppConfig.apiUrl}/auth/reset-password/verify-key`, verifyKeyDto)
    .then((res) => {
      return JSON.parse(JSON.stringify(res.data));
    });
}

const resetPasswordFinish = async (resetPasswordFinish: AuthPasswordResetFinishDto): Promise<any> => {
  return await axiosInstance
    .post(`${AppConfig.apiUrl}/auth/reset-password/finish`, resetPasswordFinish)
    .then((res) => {
      return JSON.parse(JSON.stringify(res));;
    });
}

const getAccount = async (): Promise<BaseApiResponse<UserOutput, never>> => {
  return await axiosInstance
    .get(`${AppConfig.apiUrl}/users/me`)
    .then(res => {
      return res.data;
    });
}

const isUsernameAvailable = async (username: string): Promise<{ available: boolean }> => {
  return await axiosInstance
    .get(`${AppConfig.apiUrl}/auth/check-username/${username}`)
    .then(res => {
      return res.data.data;
    });
}

const activateAccount = async (emailVerification: AuthVerifyEmailInputDto)
  : Promise<BaseApiResponse<AuthTokenOutput, never>> => {
  if (!emailVerification.email && !emailVerification.username) {
    throw new Error("Email or username is required");
  }
  return await axiosInstance
    .post(`${AppConfig.apiUrl}/auth/activate`, emailVerification)
    .then(res => {
      return res.data;
    });
}

const resendActivationEmail = async (resendVerifyEmailInputDto: AuthResendVerifyEmailInputDto): Promise<BaseApiResponse<string, never>> => {
  if (!resendVerifyEmailInputDto.email && !resendVerifyEmailInputDto.username) {
    throw new Error("Email or username is required");
  }
  return await axiosInstance
    .post(`${AppConfig.apiUrl}/auth/activate/resend`, resendVerifyEmailInputDto)
    .then(res => {
      return res.data;
    })
}


const authService = {
  register,
  login,
  changePassword,
  resetPasswordInit,
  resetPasswordFinish,
  getAccount,
  isUsernameAvailable,
  activateAccount,
  resendActivationEmail,
  resetPasswordVerifyKey
};

export default authService;
