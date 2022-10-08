import AppConfig from "../../config/app.config";
import {makeRedirectUri} from "expo-auth-session";
import * as AuthSession from "expo-auth-session";
import {axiosInstance as axios} from './api'
import {AuthIdMeVerifyResultDto} from "../models/id-me/auth-id-me-verify-result.dto";


const verifyMilitaryStatus = async (): Promise<AuthIdMeVerifyResultDto> => {
    const discovery = {
        authorizationEndpoint:
        AppConfig.oauth.idme.serviceConfiguration.authorizationEndpoint,
        tokenEndpoint: AppConfig.oauth.idme.serviceConfiguration.tokenEndpoint,
    };

    const redirectUrl = makeRedirectUri({
        useProxy: AppConfig.useExpoAuthProxy,
    });

    const authRequestOptions: AuthSession.AuthRequestConfig = {
        responseType: AuthSession.ResponseType.Code,
        clientId: AppConfig.oauth.idme.clientId,
        redirectUri: redirectUrl,
        prompt: AuthSession.Prompt.Login,
        scopes: AppConfig.oauth.idme.scopes,
    };

    const authRequest = new AuthSession.AuthRequest(authRequestOptions);

    // Get the authorization code
    const authorizeResult = await authRequest.promptAsync(discovery, {
        useProxy: true,
    });

    if (authorizeResult.type === "success") {
        // exchange code for access token
        const exchangeResult = await AuthSession.exchangeCodeAsync(
            {
                code: authorizeResult.params.code,
                clientId: AppConfig.oauth.idme.clientId,
                clientSecret: AppConfig.oauth.idme.clientSecret,
                redirectUri: redirectUrl,
                extraParams: {
                    code_verifier: authRequest.codeVerifier || "",
                },
            },
            discovery,
        );

        // Get the Verify User Military Status
        return axios.post(`${AppConfig.apiUrl}/auth/idme/verify`, {
            accessToken: exchangeResult.accessToken,
        })
            .then((response) => {
                return response.data.data;
            });
    } else {
        return Promise.reject({
            status: "ERROR",
            message: "Unable to verify military status",
        });
    }
}


const idmeService = {
    verifyMilitaryStatus
}

export default idmeService
