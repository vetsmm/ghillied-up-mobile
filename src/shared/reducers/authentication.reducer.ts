import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import AuthService from "../services/auth.service";
import {AuthRegisterInputDto} from "../models/auth/auth-register-input.dto";
import {AuthChangePasswordInputDto} from "../models/auth/auth-change-password-input.dto";
import {AuthPasswordResetInitDto} from "../models/auth/auth-password-reset-init.dto";
import {AuthPasswordResetFinishDto} from "../models/auth/auth-password-reset-finish.dto";
import {UserOutput} from "../models/users/user-output.dto";
import {AuthTokenOutput} from "../models/auth/auth-token-output.dto";
import {clearAuthenticationCredentials, clearAuthTokens, setAuthenticationCredentials, setAuthTokens} from "../jwt";
import {FlashMessageRef} from "../../components/flash-message/index";

export const initialState = {
    loading: false,
    isAuthenticated: false,
    loginSuccess: false,
    registrationSuccess: false,
    loginError: false,
    registrationError: false,
    account: {} as UserOutput,
    isVerifiedMilitary: false,
    isAdmin: false,
    isModerator: false,
    errorMessage: "", // Errors returned from server side
};

export type AuthenticationState = Readonly<typeof initialState>;

export const login = createAsyncThunk(
    "auth/login",
    async (input: {
        authTokenOutput: AuthTokenOutput,
        credentials: { username: string, password: string }
    }, thunkAPI) => {
        await setAuthTokens({
            accessToken: input.authTokenOutput.accessToken,
            refreshToken: input.authTokenOutput.refreshToken
        })

        await setAuthenticationCredentials(input.credentials);

        thunkAPI.dispatch(getAccount())
        return input.authTokenOutput;
    });

export const setLoginError = createAsyncThunk(
    "auth/setLoginError",
    async (error: any, thunkAPI) => {
        return thunkAPI.rejectWithValue(error.message);
    });

export const verifyEmail = createAsyncThunk(
    "auth/verifyEmail",
    async (authTokenOutput: AuthTokenOutput, thunkAPI) => {
        await setAuthTokens({
            accessToken: authTokenOutput.accessToken,
            refreshToken: authTokenOutput.refreshToken
        })
        thunkAPI.dispatch(getAccount());
        return authTokenOutput;
    });

export const register = createAsyncThunk(
    "auth/register",
    async (registerInput: AuthRegisterInputDto, thunkAPI) => {
        AuthService.register(registerInput)
            .then(async (response) => {
                return response;
            });
    }
);

export const changePassword = createAsyncThunk(
    "auth/change-password",
    async (changePasswordInput: AuthChangePasswordInputDto, thunkAPI) => {
        AuthService.changePassword(changePasswordInput)
            .then(async (response) => {
                return response;
            });
    }
);

export const resetPasswordInit = createAsyncThunk(
    "auth/reset-password-init",
    async (passwordReset: AuthPasswordResetInitDto, thunkAPI) => {
        AuthService.resetPasswordInit(passwordReset)
            .then(async (response) => {
                return response;
            });
    }
);

export const resetPasswordFinish = createAsyncThunk(
    "auth/reset-password-finish",
    async (passwordReset: AuthPasswordResetFinishDto, thunkAPI) => {
        AuthService.resetPasswordFinish(passwordReset)
            .then(async (response) => {
                return response;
            });
    }
);

export const getAccount = createAsyncThunk(
    "auth/account",
    async (_, thunkAPI) => {
        return AuthService.getAccount()
            .then(async (response) => {
                return response.data;
            });
    }
);


export const logout = (): any => async (dispatch: any) => {
    await clearAuthenticationCredentials(); // clear the user's credentials
    await clearAuthTokens(); // clear the user's tokens
    FlashMessageRef.current?.showMessage({
        message: 'You have been logged out',
        type: 'danger',
        style: {
            justifyContent: 'center',
            alignItems: 'center',
        }
    });
    dispatch(logoutSession());
};

export const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState: initialState as AuthenticationState,
    reducers: {
        logoutSession() {
            return {
                ...initialState,
            };
        },
        clearAuth(state) {
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
            };
        },
    },
    extraReducers(builder) {
        builder
            .addCase(login.rejected, (state, action) => {
                // @ts-ignore
                return {
                    ...initialState,
                    errorMessage: action.error ? `Error Logging in, please check your credentials and try again.` : "",
                    loginError: true,
                    loading: false,
                    loginSuccess: false,
                    isAuthenticated: false,
                }
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                return {
                    ...initialState,
                    loading: false,
                    isAuthenticated: false,
                }
            })
            .addCase(register.rejected, (state, action) => ({
                ...initialState,
                loading: false,
                errorMessage: action.error.message ?? "",
                registrationError: true,
                registrationSuccess: false,
            }))
            .addCase(changePassword.rejected, (state, action) => ({
                ...initialState,
                loading: false,
                errorMessage: action.error.message ?? "",
            }))
            .addCase(resetPasswordInit.rejected, (state, action) => ({
                ...initialState,
                loading: false,
                errorMessage: action.error.message ?? "",
            }))
            .addCase(resetPasswordFinish.rejected, (state, action) => ({
                ...initialState,
                loading: false,
                errorMessage: action.error.message ?? "",
            }))
            .addCase(getAccount.rejected, (state, action) => ({
                ...initialState,
                loading: false,
                errorMessage: action.error.message ?? "",
                isVerifiedMilitary: false,
                isAdmin: false,
                isModerator: false,
            }))
            .addCase(login.fulfilled, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    isAuthenticated: true,
                    loginSuccess: true,
                    loginError: false,
                    errorMessage: "",
                };
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                return {
                    ...state,
                    isAuthenticated: true,
                };
            })
            .addCase(register.fulfilled, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    errorMessage: "",
                    registrationError: false,
                    registrationSuccess: true,
                };
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    errorMessage: "",
                };
            })
            .addCase(resetPasswordInit.fulfilled, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    errorMessage: "",
                };
            })
            .addCase(resetPasswordFinish.fulfilled, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    errorMessage: "",
                };
            })
            .addCase(getAccount.fulfilled, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    account: action.payload as UserOutput,
                    errorMessage: "",
                    isVerifiedMilitary: action.payload.authorities.includes("ROLE_VERIFIED_MILITARY"),
                    isAdmin: action.payload.authorities.includes("ROLE_ADMIN"),
                    isModerator: action.payload.authorities.includes("ROLE_MODERATOR"),
                };
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(changePassword.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(resetPasswordInit.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(resetPasswordFinish.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAccount.pending, (state) => {
                state.loading = true;
            });
    },
});

export default AuthenticationSlice.reducer;

export const {
    logoutSession,
} = AuthenticationSlice.actions;



