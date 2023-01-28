import jwtDecode, {JwtPayload} from 'jwt-decode'

import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import * as SecureStore from "expo-secure-store";
import AppConfig from "../../config/app.config";
import {AuthTokenOutput} from "../models/auth/auth-token-output.dto";
import {AuthLoginInputDto} from "../models/auth/auth-login-input.dto";

// a little time before expiration to try refresh (seconds)
const EXPIRE_FUDGE = 10
export const STORAGE_KEY = AppConfig.AuthObject;
export const CREDENTIALS_STORAGE_KEY = AppConfig.CredentialsObject;


type Token = string

// EXPORTS

/**
 * Checks if refresh tokens are stored
 * @async
 * @returns {Promise<boolean>} Whether the user is logged in or not
 */
export const isLoggedIn = async (): Promise<boolean> => {
    const token = await getRefreshToken()
    return !!token
}

export const setAuthenticationCredentials = async (authenticationCredentials: AuthLoginInputDto): Promise<void> =>
    SecureStore.setItemAsync(CREDENTIALS_STORAGE_KEY, JSON.stringify(authenticationCredentials));

/**
 * Sets the access and refresh tokens
 * @async
 * @param {AuthTokens} tokens - Access and Refresh tokens
 * @returns {Promise}
 */
export const setAuthTokens = async (tokens: AuthTokenOutput): Promise<void> =>
    SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(tokens))

/**
 * Sets the access token
 * @async
 * @param {Promise} token - Access token
 */
export const setAccessToken = async (token: Token): Promise<void> => {
    const tokens = await getAuthTokens()
    if (!tokens) {
        throw new Error('Unable to update access token since there are not tokens currently stored')
    }

    tokens.accessToken = token
    return setAuthTokens(tokens)
}

/**
 * Clears both tokens
 * @async
 * @returns {Promise}
 */
export const clearAuthTokens = async (): Promise<void> => SecureStore.deleteItemAsync(STORAGE_KEY)

/**
 * Clears the user's authentication credentials
 * @async
 * @returns {Promise}
 */
export const clearAuthenticationCredentials = async (): Promise<void> => SecureStore.deleteItemAsync(CREDENTIALS_STORAGE_KEY);

/**
 * Returns the stored refresh token
 * @async
 * @returns {Promise<string>} Refresh token
 */
export const getRefreshToken = async (): Promise<Token | undefined> => {
    const tokens = await getAuthTokens()
    return tokens ? tokens.refreshToken : undefined
}

/**
 * Returns the stored access token
 * @async
 * @returns {Promise<string>} Access token
 */
export const getAccessToken = async (): Promise<Token | undefined> => {
    const tokens = await getAuthTokens()
    return tokens ? tokens.accessToken : undefined
}

/**
 * Gets the current access token, exchanges it with a new one if it's expired and then returns the token.
 * @async
 * @param {requestRefresh} requestRefresh - Function that is used to get a new access token
 * @returns {Promise<string>} Access token
 */
export const refreshTokenIfNeeded = async (requestRefresh: TokenRefreshRequest): Promise<Token | undefined> => {
    // use access token (if we have it)
    let accessToken = await getAccessToken()

    // check if access token is expired
    if (!accessToken || isTokenExpired(accessToken)) {
        console.log('accessToken expired')
        // do refresh
        accessToken = await refreshToken(requestRefresh)
    }

    return accessToken
}

/**
 *
 * @param {axios} axios - Axios instance to apply the interceptor to
 * @param {AuthTokenInterceptorConfig} config - Configuration for the interceptor
 */
export const applyAuthTokenInterceptor = (axios: AxiosInstance, config: AuthTokenInterceptorConfig): void => {
    if (!axios.interceptors) throw new Error(`invalid axios instance: ${axios}`)
    axios.interceptors.request.use(authTokenInterceptor(config))
}

// PRIVATE

/**
 *  Returns the refresh and access tokens
 * @async
 * @returns {Promise<AuthTokens>} Object containing refresh and access tokens
 */
const getAuthTokens = async (): Promise<AuthTokenOutput | undefined> => {
    const rawTokens = await SecureStore.getItemAsync(STORAGE_KEY)
    if (!rawTokens) return

    try {
        // parse stored tokens JSON
        return JSON.parse(rawTokens)
    } catch (error) {
        throw new Error(`Failed to parse auth tokens: ${rawTokens}`)
    }
}

/**
 * Returns the user's authentication credentials via the secure store
 * @async
 * @returns {Promise<AuthLoginInputDto>} Authentication credentials
 */
export const getUserCredentials = async (): Promise<AuthLoginInputDto | undefined> => {
    const credentials = await SecureStore.getItemAsync(CREDENTIALS_STORAGE_KEY);
    if (!credentials) return;

    try {
        // parse stored tokens JSON
        return JSON.parse(credentials)
    } catch (error) {
        throw new Error(`Failed to parse user credentials`)
    }
}

/**
 * Checks if the token is undefined, has expired or is about to expire
 *
 * @param {string} token - Access token
 * @returns {boolean} Whether or not the token is undefined, has expired or is about to expire
 */
const isTokenExpired = (token: Token): boolean => {
    if (!token) return true
    const expiresIn = getExpiresIn(token)
    return !expiresIn || expiresIn <= EXPIRE_FUDGE
}

/**
 * Gets the unix timestamp from the JWT access token
 *
 * @param {string} token - Access token
 * @returns {string} Unix timestamp
 */
const getTimestampFromToken = (token: Token): number | undefined => {
    const decoded = jwtDecode<JwtPayload>(token)

    return decoded.exp
}

/**
 * Returns the number of seconds before the access token expires or -1 if it already has
 *
 * @param {string} token - Access token
 * @returns {number} Number of seconds before the access token expires
 */
const getExpiresIn = (token: Token): number => {
    const expiration = getTimestampFromToken(token)

    if (!expiration) return -1

    return expiration - Date.now() / 1000
}

/**
 * Refreshes the access token using the provided function
 * @async
 * @param {requestRefresh} requestRefresh - Function that is used to get a new access token
 * @returns {Promise<string>} - Fresh access token
 */
const refreshToken = async (requestRefresh: TokenRefreshRequest): Promise<Token> => {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) throw new Error('No refresh token available')

    try {
        // Refresh and store access token using the supplied refresh function
        const newTokens = await requestRefresh(refreshToken)
        if (typeof newTokens === 'object' && newTokens?.accessToken) {
            await setAuthTokens(newTokens)
            return newTokens.accessToken
        } else if (typeof newTokens === 'string') {
            await setAccessToken(newTokens)
            return newTokens
        }
    } catch (error) {
        if (!axios.isAxiosError(error)) throw error

        // Failed to refresh token
        const status = error.response?.status
        if (status === 401 || status === 422) {
            // The refresh token is invalid so remove the stored tokens
            await SecureStore.deleteItemAsync(STORAGE_KEY)
            error.message = `Got ${status} on token refresh; clearing both auth tokens`
        }

        throw error
    }

    throw new Error('requestRefresh must either return a string or an object with an accessToken')
}

export type TokenRefreshRequest = (refreshToken: string) => Promise<Token | AuthTokenOutput>

export type AutoUserLoginRequest = (username: string, password: string) => Promise<Token | AuthTokenOutput>

export interface AuthTokenInterceptorConfig {
    header?: string
    headerPrefix?: string
    requestRefresh: TokenRefreshRequest,
    timeout?: number
    headers?: Record<string, string>
}

/**
 * Function that returns an Axios Interceptor that:
 * - Applies that right auth header to requests
 * - Refreshes the access token when needed
 * - Puts subsequent requests in a queue and executes them in order after the access token has been refreshed.
 *
 * @param {AuthTokenInterceptorConfig} config - Configuration for the interceptor
 * @returns {Promise<AxiosRequestConfig} Promise that resolves in the supplied requestConfig
 */
export const authTokenInterceptor =
    ({
         header = 'Authorization',
         headerPrefix = 'Bearer ',
         timeout = 50 * 1000,
         requestRefresh
     }: AuthTokenInterceptorConfig) =>
        async (requestConfig: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
            requestConfig.timeout = timeout
            requestConfig.responseType = 'json'
            requestConfig.headers = requestConfig.headers || {}
            requestConfig.transitional = {silentJSONParsing: true}

            // We need refresh token to do any authenticated requests
            const refreshToken = await getRefreshToken()
            if (!refreshToken) return requestConfig

            const authenticateRequest = (token: string | undefined) => {
                if (token) {
                    requestConfig.headers = requestConfig.headers ?? {}
                    requestConfig.headers[header] = `${headerPrefix}${token}`
                }
                return requestConfig
            }

            // Queue the request if another refresh request is currently happening
            if (isRefreshing) {
                return new Promise((resolve: (token?: string) => void, reject) => {
                    queue.push({resolve, reject})
                }).then(authenticateRequest)
            }

            // Do refresh if needed
            let accessToken
            try {
                setIsRefreshing(true)
                accessToken = await refreshTokenIfNeeded(requestRefresh)
            } catch (error) {
                console.log(JSON.stringify(error))
                console.log('Token refresh failed', error)
                declineQueue(error as Error)

                if (error instanceof Error) {
                    error.message = `Unable to refresh access token for request due to token refresh error: ${error.message}`
                }

                throw error
            } finally {
                setIsRefreshing(false)
            }
            resolveQueue(accessToken)

            // add token to headers
            return authenticateRequest(accessToken)
        }

type RequestsQueue = {
    resolve: (token?: string) => void
    reject: (reason?: unknown) => void
}[]

let isRefreshing = false
let queue: RequestsQueue = []

/**
 * Check if tokens are currently being refreshed
 *
 * @returns {boolean} True if the tokens are currently being refreshed, false is not
 */
export function getIsRefreshing(): boolean {
    return isRefreshing
}

/**
 * Update refresh state
 *
 * @param {boolean} newRefreshingState
 */
export function setIsRefreshing(newRefreshingState: boolean): void {
    isRefreshing = newRefreshingState
}

/**
 * Function that resolves all items in the queue with the provided token
 * @param token New access token
 */
const resolveQueue = (token?: string) => {
    queue.forEach((p) => {
        p.resolve(token)
    })

    queue = []
}

/**
 * Function that declines all items in the queue with the provided error
 * @param error Error
 */
const declineQueue = (error: Error) => {
    queue.forEach((p) => {
        p.reject(error)
    })

    queue = []
}
