import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SplashScreen from "../../screens/auth/splash.screen";
import LoginScreen from "../../screens/auth/login.screen";
import RegisterScreen from "../../screens/auth/register.screen";
import VerifyEmailScreen from "../../screens/auth/verify-email.screen";
import PasswordResetInitScreen from "../../screens/auth/password-reset-init.screen";
import PasswordResetFinishScreen from "../../screens/auth/password-reset-finish.screen";
import PasswordResetCodeScreen from "../../screens/auth/password-reset-code.screen";
import {colorsVerifyCode} from "../../components/colors";
import NewSignInLocationScreen from "../../screens/auth/new-signin-location.screen";
import SubnetVerificationScreen from "../../screens/auth/subnet-verification.screen";
import MfaNoAuthCodeEntryScreen from "../../screens/auth/mfa-no-auth-code-entry.screen";
import EmailLoginScreen from "../../screens/auth/email-login.screen";

interface NoAuthScreenProps {
    name: string;
    path: string;
    parse?: any;
    stringify?: any;
    component: any;
    options?: any;
}

export const noAuthScreens: Array<NoAuthScreenProps> = [
    {
        name: "Splash",
        path: "",
        component: SplashScreen,
        options: {
            headerShown: false,
        },
    },
    {
        name: "Login",
        path: "auth/login",
        component: LoginScreen,
        options: {
            headerShown: true,
            headerTitle: 'Login',
            gestureEnabled: true,
            // title bar color
            headerStyle: {
                backgroundColor: colorsVerifyCode.primary,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: colorsVerifyCode.white,
            },
            headerTintColor: colorsVerifyCode.white,
            animationTypeForReplace: "pop"
        }
    },
    {
        name: "Register",
        path: "auth/register",
        component: RegisterScreen,
        options: {
            headerShown: true,
            headerTitle: 'Register',
            gestureEnabled: true,
            // title bar color
            headerStyle: {
                backgroundColor: colorsVerifyCode.primary,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: colorsVerifyCode.white,
            },
            headerTintColor: colorsVerifyCode.white,
            animationTypeForReplace: "pop"
        }
    },
    {
        name: "VerifyEmail",
        path: "auth/activate/:activationCode",
        component: VerifyEmailScreen,
        options: {
            headerShown: false,
            animationTypeForReplace: "pop"
        }
    },
    {
        name: "NewSignInLocation",
        path: "auth/new-sign-in-location",
        component: NewSignInLocationScreen,
        options: {
            headerShown: true,
            headerTitle: 'New Location',
            backTitle: 'Login',
            gestureEnabled: true,
            headerStyle: {
                backgroundColor: colorsVerifyCode.primary,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: colorsVerifyCode.white,
            },
            headerTintColor: colorsVerifyCode.white,
            animationTypeForReplace: "pop"
        }
    },
    {
        name: "PasswordResetInit",
        path: "auth/password-reset-init",
        component: PasswordResetInitScreen,
        options: {
            headerShown: true,
            headerTitle: 'Password Reset',
            gestureEnabled: true,
            // title bar color
            headerStyle: {
                backgroundColor: colorsVerifyCode.primary,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: colorsVerifyCode.white,
            },
            headerTintColor: colorsVerifyCode.white,
            animationTypeForReplace: "pop"
        }
    },
    {
        name: "PasswordResetFinish",
        path: "auth/password-reset-finish",
        component: PasswordResetFinishScreen,
        options: {
            headerShown: true,
            headerTitle: 'Password Reset',
            gestureEnabled: true,
            // title bar color
            headerStyle: {
                backgroundColor: colorsVerifyCode.primary,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: colorsVerifyCode.white,
            },
            headerTintColor: colorsVerifyCode.white,
            animationTypeForReplace: "pop"
        }
    },
    {
        name: "MfaNoAuthCodeEntry",
        path: "auth/mfa-no-auth-code-entry",
        component: MfaNoAuthCodeEntryScreen,
        options: {
            headerShown: true,
            headerTitle: 'Login 2FA',
            gestureEnabled: true,
            // title bar color
            headerStyle: {
                backgroundColor: colorsVerifyCode.primary,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: colorsVerifyCode.white,
            },
            headerTintColor: colorsVerifyCode.white,
            animationTypeForReplace: "pop"
        }
    },
    {
        name: "PasswordResetCode",
        path: "auth/password-reset/:resetKey",
        component: PasswordResetCodeScreen,
        options: {
            headerShown: true,
            headerTitle: 'Password Reset',
            gestureEnabled: true,
            // title bar color
            headerStyle: {
                backgroundColor: colorsVerifyCode.primary,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: colorsVerifyCode.white,
            },
            headerTintColor: colorsVerifyCode.white,
            animationTypeForReplace: "pop"
        }
    },
    {
        name: "SubnetVerification",
        path: "auth/confirm-subnet/:jwtToken",
        component: SubnetVerificationScreen,
        options: {
            headerShown: true,
            headerTitle: 'Verify New Location',
            gestureEnabled: true,
            // title bar color
            headerStyle: {
                backgroundColor: colorsVerifyCode.primary,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: colorsVerifyCode.white,
            },
            headerTintColor: colorsVerifyCode.white,
            animationTypeForReplace: "pop"
        }
    },
    {
        name: "EmailLoginLink",
        path: "auth/login-link/:jwtToken",
        component: EmailLoginScreen,
        options: {
            headerShown: true,
            headerTitle: 'Email Login',
            gestureEnabled: true,
            // title bar color
            headerStyle: {
                backgroundColor: colorsVerifyCode.primary,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: colorsVerifyCode.white,
            },
            headerTintColor: colorsVerifyCode.white,
            animationTypeForReplace: "pop"
        }
    },
];

export const getNoAuthScreenRoutes = () => {
    const routes: any = {};
    noAuthScreens.forEach((screen: any) => {
        routes[screen.name] = screen.path;
    });
    return routes;
};

const NoAuthStack = createNativeStackNavigator();

export default function NoAuthStackNavigator() {
    return (
        <NoAuthStack.Navigator>
            {noAuthScreens.map((screen) => {
                return (
                    <NoAuthStack.Screen
                        name={screen.name}
                        component={screen.component}
                        key={screen.name}
                        options={screen.options}
                    />
                );
            })}
        </NoAuthStack.Navigator>
    );
}
