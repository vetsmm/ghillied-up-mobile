import React from "react";
import MainContainer from "../../../components/containers/MainContainer";
import styles from "./styles";
import {ScrollView, Text, View} from "native-base";
import {Linking, TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {colorsVerifyCode} from "../../../components/colors";
import {useAppDispatch} from "../../../store";
import {logout} from "../../../shared/reducers/authentication.reducer";
import SmallText from "../../../components/texts/small-text";
import Constants from "expo-constants";

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
        Linking.openURL(url);
    }

    const sections = [
        {
            title: "Security",
            buttons: [
                {
                    title: "Change Password",
                    onPress: () => moveTo("AccountChangePassword", {})
                }
                // TODO: Add Change Email
                // TODO: Add Change Phone Number
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
                    onPress: () => openLink("https://www.facebook.com/ghilliedupapp")
                },
                {
                    title: "Follow Ghillied Up on Instagram",
                    onPress: () => openLink("https://www.instagram.com/ghillied_up/")
                },
                {
                    title: "Follow Ghillied Up on Twitter",
                    onPress: () => openLink("https://twitter.com/ghilliedupapp")
                },
                {
                    title: "Follow Ghillied Up on LinkedIn",
                    onPress: () => openLink("https://www.linkedin.com/company/ghilliedup")
                }
            ]
        },
        {
            title: "Legal",
            buttons: [
                {
                    title: "Terms of Service",
                    onPress: () => openLink("https://ghilliedup.com/terms")
                },
                {
                    title: "Privacy Policy",
                    onPress: () => openLink("https://ghilliedup.com/privacy")
                },
                {
                    title: "FAQ",
                    onPress: () => openLink("https://ghilliedup.com/faq")
                }
            ]
        },
        {
            title: "Misc",
            buttons: [
                {
                    title: "Contact Us",
                    onPress: () => openLink("https://ghilliedup.com/contact")
                },
                {
                    title: "Report a Bug",
                    onPress: () => openLink("https://ghilliedup.com/contact")
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

                {/* TODO: Fix the logout, its broke AF */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => dispatch(logout())}
                >
                    <Text style={styles.logoutText}>Log Out</Text>
                    <MaterialIcons name="logout" size={24} color={colorsVerifyCode.white}/>
                </TouchableOpacity>

                <View style={styles.appVersion}>
                    <SmallText>
                        App Version: {Constants.manifest?.version} {Constants.manifest?.releaseChannel && ` - (${Constants.manifest?.releaseChannel})`}
                    </SmallText>
                </View>
            </ScrollView>
        </MainContainer>
    )
}

export default AccountSettings;
