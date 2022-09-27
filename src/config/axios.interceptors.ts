import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AppConfig from "./app.config";
import JwtService from "../shared/services/jwt.service";

const TIMEOUT = 50 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = AppConfig.apiUrl;
axios.defaults.headers.common["Content-Type"] = "application/json";

const setupAxiosInterceptors = (onUnauthenticated: any, onServerError: any) => {
  const onRequestSuccess = async (config: any) => {
    const accessToken = await JwtService.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  };
  const onResponseSuccess = (response: any) => response;
  const onResponseError = (err: any) => {
    const status = err.statusCode ? err.statusCode : err.status;
    if (status === 403 || status === 401) {
      console.log("onResponseError", err);
      onUnauthenticated(err);
    }
    if (status >= 500) {
      return onServerError(err);
    }
    return Promise.reject(err.response);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
