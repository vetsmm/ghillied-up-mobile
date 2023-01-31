import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AccountScreen from "../../screens/account/main/account.screen";
import AccountSettings from "../../screens/account/settings";
import {colorsVerifyCode} from "../../components/colors";
import PushNotificationSettings from "../../screens/account/notification-settings";
import MyAccount from "../../screens/account/my-account";
import ChangePassword from "../../screens/account/change-password";
import UpdateUserInformation from "../../screens/account/update-user-information";
import ChangePhoneNumber from "../../screens/account/change-phone-number";
import SessionsScreen from "../../screens/account/sessions";
import TwoStepVerificationScreen from "../../screens/account/two-step-verification";
import MfaCodeEntryScreen from "../../screens/account/two-step-verification/subscreens/mfa-code-entry-screen";
import BackupCodesScreen from "../../screens/account/two-step-verification/subscreens/backup-codes.screen";

interface AccountScreenProps {
    name: string;
    path: string;
    parse?: any;
    stringify?: any;
    component: any;
    options?: any;
}

export const accountScreens: Array<AccountScreenProps> = [
    {
        name: "AccountHome",
        path: "",
        component: AccountScreen,
        options: {
            title: "",
            headerShown: false,
        },
    },
    {
        name: "AccountPushNotificationSettings",
        path: "settings/push-notification",
        component: PushNotificationSettings,
        options: {
            title: "Push Notifications",
            headerShown: true,
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
        }
    },
    {
        name: "MyAccount",
        path: "my-account",
        component: MyAccount,
        options: {
            title: "My Account",
            headerShown: true,
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
        }
    },
    {
        name: "AccountUserInformation",
        path: "update/user-information",
        component: UpdateUserInformation,
        options: {
            title: "Update User Information",
            headerShown: true,
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
        }
    },
    {
        name: "AccountChangePassword",
        path: "update/password",
        component: ChangePassword,
        options: {
            title: "Change Password",
            headerShown: true,
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
        }
    },
    {
        name: "AccountChangePhoneNumber",
        path: "update/phone-number",
        component: ChangePhoneNumber,
        options: {
            title: "Change Phone Number",
            headerShown: true,
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
        }
    },
    {
        name: "AccountSessions",
        path: "sessions",
        component: SessionsScreen,
        options: {
            title: "Active Sessions",
            headerShown: true,
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
        }
    },
    {
        name: "AccountTwoStepVerification",
        path: "two-step-verification",
        component: TwoStepVerificationScreen,
        options: {
            title: "Two Step Verification",
            headerShown: true,
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
        }
    },
    {
        name: "MfaCodeEntry",
        path: "mfa-code-entry",
        component: MfaCodeEntryScreen,
        options: {
            title: "MFA Code",
            headerShown: true,
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
        }
    },
    {
        name: "AccountBackupCodes",
        path: "backup-codes",
        component: BackupCodesScreen,
        options: {
            title: "Backup Codes",
            headerShown: true,
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
        }
    },
    {
        name: "AccountSettings",
        path: "settings",
        component: AccountSettings,
        options: {
            title: "Settings",
            headerShown: true,
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
        }
    },
];

export const getAccountRoutes = () => {
    const routes: any = {};
    accountScreens.forEach((screen: any) => {
        routes[screen.name] = screen.path;
    });
    return routes;
};

const AccountStack = createNativeStackNavigator();

export default function AccountStackScreen() {
    return (
        <AccountStack.Navigator>
            {accountScreens.map((screen) => {
                return (
                    <AccountStack.Screen
                        name={screen.name}
                        component={screen.component}
                        key={screen.name}
                        options={screen.options}
                    />
                );
            })}
        </AccountStack.Navigator>
    );
}
