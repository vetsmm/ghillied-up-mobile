import React from "react";
import MainContainer from "../../../components/containers/MainContainer";
import styles from "./styles";
import RegularText from "../../../components/texts/regular-texts";
import {Spinner, Switch, Text, View} from "native-base";
import {UserPushNotificationSettingsDto} from "../../../shared/models/settings/user-push-notification-settings.dto";
import {useNavigation} from "@react-navigation/native";
import userSettingsService from "../../../shared/services/user-settings.service";
import {UserPushNotificationsInputDto} from "../../../shared/models/settings/user-push-notifications-input.dto";

type TOGGLE_TYPE = "POST_REACTION" | "COMMENT_REACTION" | "POST_REPLY" | "NEW_ACTIVITY";

const ItemToggle = ({title, value, onValueChange, isLoading, isDisabled}) => {
    return (
        <View style={styles.sectionItem}>
            <Text style={styles.sectionButtonText}>{title}</Text>
            {isLoading ? (
                <Spinner color="blue"/>
            ) : (
                <Switch size="lg" onToggle={onValueChange} value={value} isDisabled={isDisabled}/>
            )}
        </View>
    );
}

export const PushNotificationSettings = () => {
    const [{
        isPostReactionLoading,
        isCommentReactionLoading,
        isPostReplyLoading,
        isNewActivityLoading,
    }, setIsLoading] = React.useState({
        isPostReactionLoading: false,
        isCommentReactionLoading: false,
        isPostReplyLoading: false,
        isNewActivityLoading: false,
    });
    const [pushNotificationSettings, setPushNotificationSettings] = React.useState<UserPushNotificationSettingsDto | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const navigation: any = useNavigation();

    React.useEffect(() => {
        const initialLoadPushNotificationSettings = navigation.addListener('focus', async () => {
            setIsLoading({
                isPostReactionLoading: true,
                isCommentReactionLoading: true,
                isPostReplyLoading: true,
                isNewActivityLoading: true,
            });
            try {
                const {data} = await userSettingsService.getPushNotificationSettings();
                setPushNotificationSettings(data);
                setErrorMessage(null);
            } catch (e) {
                setErrorMessage("Error loading push notification settings");
            }
            setIsLoading({
                isPostReactionLoading: false,
                isCommentReactionLoading: false,
                isPostReplyLoading: false,
                isNewActivityLoading: false,
            });
        });

        return initialLoadPushNotificationSettings;
    }, [navigation]);

    const updatePushNotificationSettings = async (settings: UserPushNotificationsInputDto) => {
        try {
            const {data} = await userSettingsService.updatePushNotificationSettings(settings);
            setPushNotificationSettings(data);
            setErrorMessage(null);
        } catch (e) {
            setErrorMessage("Error updating push notification settings");
        }
        setIsLoading({
            isPostReactionLoading: false,
            isCommentReactionLoading: false,
            isPostReplyLoading: false,
            isNewActivityLoading: false,
        });
    }

    const onPress = async (type: TOGGLE_TYPE, value: boolean) => {
        switch (type) {
            case "POST_REACTION":
                setIsLoading(prevState => ({...prevState, isPostReactionLoading: true}));
                await updatePushNotificationSettings({postReactions: value});
                break;
            case "COMMENT_REACTION":
                setIsLoading(prevState => ({...prevState, isCommentReactionLoading: true}));
                await updatePushNotificationSettings({commentReactions: value});
                break;
            case "POST_REPLY":
                setIsLoading(prevState => ({...prevState, isPostReplyLoading: true}));
                await updatePushNotificationSettings({postComments: value});
                break;
            case "NEW_ACTIVITY":
                setIsLoading(prevState => ({...prevState, isNewActivityLoading: true}));
                await updatePushNotificationSettings({postActivity: value});
        }
    }

    return (
        <MainContainer style={styles.container}>
            <RegularText style={{alignSelf: "center"}}>Adjust your push notification settings</RegularText>

            <View style={styles.section}>
                <RegularText style={styles.sectionTitle}>Activity Push Notifications</RegularText>

                {errorMessage && <RegularText
                    style={{color: "red", alignSelf: "center", marginBottom: 10}}>{errorMessage}</RegularText>}

                <ItemToggle
                    title="Reactions to my posts"
                    value={pushNotificationSettings?.postReactions ?? false}
                    onValueChange={(value) => onPress("POST_REACTION", value)}
                    isLoading={isPostReactionLoading}
                    isDisabled={errorMessage !== null}
                />
                <ItemToggle
                    title="Reactions to my comments"
                    value={pushNotificationSettings?.commentReactions ?? false}
                    onValueChange={(value) => onPress("COMMENT_REACTION", value)}
                    isLoading={isCommentReactionLoading}
                    isDisabled={errorMessage !== null}
                />
                <ItemToggle
                    title="Post Replies"
                    value={pushNotificationSettings?.postComments ?? false}
                    onValueChange={(value) => onPress("POST_REPLY", value)}
                    isLoading={isPostReplyLoading}
                    isDisabled={errorMessage !== null}
                />
                <ItemToggle
                    title="New activity on posts I've replied to"
                    value={pushNotificationSettings?.postActivity ?? false}
                    onValueChange={(value) => onPress("NEW_ACTIVITY", value)}
                    isLoading={isNewActivityLoading}
                    isDisabled={errorMessage !== null}
                />
            </View>
        </MainContainer>
    );
}

export default PushNotificationSettings;
