import React from "react";
import MainContainer from "../../../components/containers/MainContainer";
import styles from "./styles";
import {ScrollView, Text, View} from "native-base";
import {TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {colorsVerifyCode} from "../../../components/colors";
import {useAppDispatch} from "../../../store";
import {logout} from "../../../shared/reducers/authentication.reducer";
import SmallText from "../../../components/texts/small-text";
import Constants from "expo-constants";
import * as WebBrowser from 'expo-web-browser';
import AppConfig from "../../../config/app.config";


interface SectionButton {
    title: string;
    onPress: () => void;
}

interface Section {
    title: string;
    buttons: SectionButton[];
}

export const AccountSettings = () => {
    const dispatch = useAppDispatch();
    const navigation: any = useNavigation();

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    // Open External Links
    const openLink = (url: string) => {
        WebBrowser.openBrowserAsync(url);
    }

    const sections = [
        {
            title: "Security",
            buttons: [
                {
                    title: "Change Password",
                    onPress: () => moveTo("AccountChangePassword", {})
                },
                {
                    title: "Add/Change Phone Number",
                    onPress: () => moveTo("AccountChangePhoneNumber", {})
                },
                {
                    title: "Where you're logged in",
                    onPress: () => moveTo("AccountSessions", {})
                },
                {
                    title: "Two-Step Verification (2FA)",
                    onPress: () => moveTo("AccountTwoStepVerification", {})
                }
                // TODO: Add Change Email
                // TODO: Add Additional Emails

            ]
        },
        {
            title: "Preferences",
            buttons: [
                {
                    title: "Account",
                    onPress: () => moveTo("MyAccount", {})
                },
                {
                    title: "Update User Information",
                    onPress: () => moveTo("AccountUserInformation", {})
                },
                {
                    title: "Notifications",
                    onPress: () => moveTo("AccountPushNotificationSettings", {})
                }
            ]
        },
        {
            title: "General",
            buttons: [
                {
                    title: "Like Ghillied Up on Facebook",
                    onPress: () => openLink(AppConfig.links.facebook)
                },
                {
                    title: "Follow Ghillied Up on Instagram",
                    onPress: () => openLink(AppConfig.links.instagram)
                },
                {
                    title: "Follow Ghillied Up on Twitter",
                    onPress: () => openLink(AppConfig.links.twitter)
                },
                {
                    title: "Follow Ghillied Up on LinkedIn",
                    onPress: () => openLink(AppConfig.links.linkedin)
                },
                {
                    title: "Join our Discord!",
                    onPress: () => openLink(AppConfig.links.discord)
                }
            ]
        },
        {
            title: "Legal",
            buttons: [
                {
                    title: "Terms of Service",
                    onPress: () => openLink(AppConfig.links.termsOfService)
                },
                {
                    title: "Privacy Policy",
                    onPress: () => openLink(AppConfig.links.privacyPolicy)
                },
                {
                    title: "FAQ",
                    onPress: () => openLink(AppConfig.links.faq)
                }
            ]
        },
        {
            title: "Misc",
            buttons: [
                {
                    title: "Contact Us",
                    onPress: () => openLink(AppConfig.links.contactUs)
                },
                {
                    title: "Report a Bug",
                    onPress: () => openLink(AppConfig.links.contactUs)
                },
            ],
        },
    ] as Section[];

    const _renderSection = (section: Section) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.buttons.map((button, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.sectionButton}
                    onPress={button.onPress}
                >
                    <Text style={styles.sectionButtonText}>{button.title}</Text>
                    {/* Add Right Pointing Chevron */}
                    <Ionicons name="chevron-forward" size={24} color={colorsVerifyCode.secondary}/>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <MainContainer style={styles.container}>
            <ScrollView style={styles.list}>
                {sections.map((section, index) => (
                    <View key={index}>
                        {_renderSection(section)}
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => dispatch(logout())}
                >
                    <Text style={styles.logoutText}>Log Out</Text>
                    <MaterialIcons name="logout" size={24} color={colorsVerifyCode.white}/>
                </TouchableOpacity>

                <View style={styles.appVersion}>
                    <SmallText>
                        App Version: {Constants.manifest?.version} {Constants.manifest?.extra?.appEnv && ` - (${Constants.manifest?.extra?.appEnv})`}
                    </SmallText>
                </View>
            </ScrollView>
        </MainContainer>
    )
}

export default AccountSettings;
