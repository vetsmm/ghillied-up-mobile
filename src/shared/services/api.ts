import axios from 'axios'
import AppConfig from "../../config/app.config";
import {
    applyAuthTokenInterceptor, getAccessToken,
    TokenRefreshRequest
} from "../jwt";
import * as Sentry from "sentry-expo";
import {AuthTokenOutput} from "../models/auth/auth-token-output.dto";

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
            if (data) {
                return JSON.parse(data); // TODO: This is a weird bug, where the data is a string, not an object
            }
            return data;
        }
    ]
})

// 2. Define token refresh function.
const requestRefresh: TokenRefreshRequest = async (accessToken: string, refreshToken: string): Promise<AuthTokenOutput> => {

    // Important! Do NOT use the axios instance that you supplied to applyAuthTokenInterceptor
    // because this will result in an infinite loop when trying to refresh the token.
    // Use the global axios client or a different instance
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {refreshToken}, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    console.log('refresh response', response);
    return response.data.data;
}

// 3. Add interceptor to your axios instance
applyAuthTokenInterceptor(axiosInstance, {
    requestRefresh,
    timeout: TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const applyAxiosErrorInterceptor = (axiosInstance: any, onUnauthenticated) => {
    axiosInstance.interceptors.response.use(
        (response: any) => {
            return response;
        },
        async (error: any) => {
            if (error.response.status === 401 && (
                error.response.data.error.message === "User is not active" ||
                error.response.data.error.message === "Error: No auth token")
            ) {
                onUnauthenticated();
            }

            if (!error.response) {
                Sentry.Native.captureException(error);
            }

            // If the error is a 401, then we need to refresh the token
            // if (error.response && error.response.status === 401) {
            //     console.log('401 error', error.response);
            //     return axiosInstance.request(error.config);
            // }

            return Promise.reject(error.response);
        }
    );
}
