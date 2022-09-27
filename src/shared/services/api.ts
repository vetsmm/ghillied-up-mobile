import axios from 'axios'
import AppConfig from "../../config/app.config";
import {applyAuthTokenInterceptor, TokenRefreshRequest} from "../jwt";

const BASE_URL = AppConfig.apiUrl;
const TIMEOUT = 50 * 1000;

// 1. Create an axios instance that you wish to apply the interceptor to
axios.defaults.headers.common["Content-Type"] = "application/json";
export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
    transformResponse: [
        (data) => {
            return JSON.parse(data); // TODO: This is a weird bug, where the data is a string, not an object
        }
    ]
})

// 2. Define token refresh function.
const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<string> => {

    // Important! Do NOT use the axios instance that you supplied to applyAuthTokenInterceptor
    // because this will result in an infinite loop when trying to refresh the token.
    // Use the global axios client or a different instance
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken })

    return response.data.data.accessToken
}

// 3. Add interceptor to your axios instance
applyAuthTokenInterceptor(axiosInstance, {
    requestRefresh,
    timeout: TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
})
