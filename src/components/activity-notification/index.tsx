import React, {memo} from "react";
import {useNavigation} from "@react-navigation/native";
import {Avatar, Box, HStack, Pressable, VStack} from "native-base";
import RegularText from "../texts/regular-texts";
import {NotificationType} from "../../shared/models/notifications/notification-type";
import stringUtils from "../../shared/utils/string.utils";
import {getTimeAgoShort} from "../../shared/utils/date-utils";
import SmallText from "../texts/small-text";
import {TouchableOpacity} from "react-native";
import {colorsVerifyCode} from "../colors";
import {useAppDispatch} from "../../store";
import {markNotificationsAsRead} from "../../shared/reducers/notifications.reducer";

export const ActivityNotification: React.FC<{ notification: any }> = ({notification}) => {
    const dispatch = useAppDispatch();
    const navigation: any = useNavigation();
    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    const markAsReadAndMove = () => {
        dispatch(markNotificationsAsRead({
            ids: [{
                id: notification.notificationId,
                activityId: notification.activityId
            }]
        }));
        moveTo("Posts", {params: {postId: notification.postId,}, screen: "PostDetail"});
    }

    return (
        <Pressable onPress={() => markAsReadAndMove()}>
            <Box
                flexDirection="column"
                rounded={"lg"}
                backgroundColor={"transparent"}
                borderWidth={notification.read ? 0 : 1}
                borderColor={colorsVerifyCode.accent}
            >
                <HStack justifyContent="space-between" space={2}>
                    <HStack justifyContent="space-evenly">
                        <TouchableOpacity onPress={() => moveTo("Ghillies", {
                            screen: "GhillieDetail",
                            params: {ghillieId: notification.ghillieId}
                        })}>
                            <VStack space={1} alignItems="center">
                                <Avatar
                                    width="12"
                                    height="12"
                                    borderWidth="2"
                                    source={
                                        notification.ghillieImageUrl
                                            ? {uri: notification.ghillieImageUrl}
                                            : require("../../../assets/logos/icon.png")
                                    }
                                />
                            </VStack>
                        </TouchableOpacity>
                    </HStack>
                    <VStack
                        space={0}
                        flex={1}
                    >
                        <HStack justifyContent="space-between">
                            <SmallText
                                style={{
                                    fontWeight: "bold",
                                    color: colorsVerifyCode.secondary,
                                }}
                            >
                                {`${notification.ghillieName}: ${getTimeAgoShort(notification.createdDate)}`}
                            </SmallText>
                        </HStack>
                        <RegularText
                            style={{
                                flexWrap: "wrap",
                            }}
                        >
                            {notification?.notificationMessage}
                        </RegularText>

                        {notification.type === NotificationType.POST_COMMENT && (
                            <SmallText
                                style={{
                                    flexWrap: "wrap",
                                }}
                            >
                                {stringUtils.trimString(notification.commentContent, 40)}
                            </SmallText>
                        )}
                    </VStack>
                </HStack>
            </Box>
        </Pressable>
    );
}

export default memo(ActivityNotification);
