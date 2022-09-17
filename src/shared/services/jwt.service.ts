import * as SecureStore from "expo-secure-store";
import AppConfig from "../../config/app.config";
import {AuthTokenOutput} from "../models/auth/auth-token-output.dto";
import jwtDecode, { JwtPayload } from "jwt-decode";

const authObjectExists = async () => {
  const token = await SecureStore.getItemAsync(AppConfig.AuthObject);
  return token !== null;
}

const getAuthObject = async (): Promise<null | AuthTokenOutput>=> {
  const authObject = await SecureStore.getItemAsync(AppConfig.AuthObject);
  return authObject ? JSON.parse(authObject) : null;
}

const getAccessToken = async (): Promise<null | string> => {
  const authObject = await getAuthObject();
  return authObject ? authObject.accessToken : null;
}

const getRefreshToken = async (): Promise<null | string> => {
  const authObject = await getAuthObject();
  return authObject ? authObject.refreshToken : null;
}

const updateAuthObject = async (authObject: AuthTokenOutput): Promise<void> => {
  // if auth object exists, delete it
  if (await authObjectExists()) {
    await deleteAuthObject();
  }
  await SecureStore.setItemAsync(AppConfig.AuthObject, JSON.stringify(authObject));
}

const deleteAuthObject = async (): Promise<void> => {
  if (await authObjectExists()) {
    await SecureStore.deleteItemAsync(AppConfig.AuthObject);
  }
}

const isTokenExpired = async (): Promise<boolean> => {
  const authObject = await getAuthObject();
  console.log('authObject', authObject);
  if (!authObject) {
    return true;
  }
  const decoded = jwtDecode<JwtPayload>(authObject.accessToken);
  // undefined check
  if (!decoded.exp) {
    console.log('decoded.exp is undefined');
    return true;
  }
  console.log('decoded.exp', decoded.exp);
  const currentTime = new Date().getTime() / 1000;
  return decoded.exp < currentTime;
}

const jwtService ={
  authObjectExists,
  getAuthObject,
  getAccessToken,
  getRefreshToken,
  updateAuthObject,
  deleteAuthObject,
  isTokenExpired
}

export default jwtService;
