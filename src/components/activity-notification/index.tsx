import React from "react";
import {useNavigation} from "@react-navigation/native";
import {Avatar, Card, HStack, Pressable, Text, VStack} from "native-base";
import RegularText from "../texts/regular-texts";
import {NotificationType} from "../../shared/models/notifications/notification-type";
import stringUtils from "../../shared/utils/string.utils";
import {getTimeAgoShort} from "../../shared/utils/date-utils";
import SmallText from "../texts/small-text";
import {TouchableOpacity} from "react-native-gesture-handler";
import {colorsVerifyCode} from "../colors";
import {useAppDispatch} from "../../store";
import {markNotificationsAsRead} from "../../shared/reducers/notifications.reducer";

export function ActivityNotification({notification}: { notification: any }) {
    const dispatch = useAppDispatch();
    const navigation: any = useNavigation();
    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    const markAsReadAndMove = () => {
        dispatch(markNotificationsAsRead([notification.id]));
        moveTo("Posts", {params: {postId: notification.postId,}, screen: "PostDetail"});
    }

    return (
        <Pressable onPress={() => markAsReadAndMove()}>
            <Card
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
                                <Pressable>
                                    <Avatar
                                        width="12"
                                        height="12"
                                        borderWidth="2"
                                        source={{
                                            uri: notification.ghillieImageUrl ? notification.ghillieImageUrl : "https://picsum.photos/1000",
                                        }}
                                    />
                                </Pressable>
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
                            {notification.message}:
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
            </Card>
        </Pressable>
    );
}

export default ActivityNotification;
