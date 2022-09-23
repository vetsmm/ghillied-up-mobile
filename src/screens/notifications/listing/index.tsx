import {Center, FlatList, Spinner, Text, View} from "native-base";
import React, {useCallback} from "react";
import styles from "../../ghillies/listing/styles";
import MainContainer from "../../../components/containers/MainContainer";
import uuid from "react-native-uuid";
import {RefreshControl, TouchableOpacity} from "react-native";
import {Colors} from "../../../shared/styles";
import {PageInfo} from "../../../shared/models/pagination/types";
import {BaseNotificationDto} from "../../../shared/models/notifications/notification.dto";
import notificationService from "../../../shared/services/notifications.service";
import ActivityNotification from "../../../components/activity-notification";
import {useNavigation} from "@react-navigation/native";
import RegularText from "../../../components/texts/regular-texts";
import {FontAwesome5} from "@expo/vector-icons";
import OkCancelModel from "../../../components/modals/ok-cancel-modal";
import {IRootState, useAppDispatch} from "../../../store";
import {getUnreadNotifications} from "../../../shared/reducers/notifications.reducer";
import {useSelector} from "react-redux";

function NotificationListingScreen() {
    const [pageInfo, setPageInfo] = React.useState<PageInfo>({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
    });
    const [clearAllOpen, setClearAllOpen] = React.useState(false);

    const [isLoading, setIsLoading] = React.useState(false);
    const [notifications, setNotifications] = React.useState<BaseNotificationDto[]>([]);

    const isReduxLoading = useSelector(
        (state: IRootState) => state.notifications.loading
    );

    const navigation: any = useNavigation();
    const dispatch = useAppDispatch();

    // Load Initial Data
    React.useEffect(() => {
        const initialLoad = navigation.addListener('focus', async () => {
            setIsLoading(true);
            const {data, meta} = await notificationService.getNotifications();
            setNotifications(data);
            setPageInfo(meta);
            setIsLoading(false);
        });

        return initialLoad;
    }, [navigation]);

    const handleRefresh = useCallback(async () => {
        await notificationService.getNotifications()
            .then((response) => {
                setNotifications(response.data);
                setPageInfo(response.meta);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const loadNextPage = async () => {
        if (pageInfo.hasNextPage && !isLoading && pageInfo.endCursor) {
            await notificationService.getNotifications({
                cursor: pageInfo.endCursor,
            })
                .then((response) => {
                    setNotifications(response.data);
                    setPageInfo(response.meta);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const clearNotifications = async () => {
        await notificationService.markAllNotificationsAsRead()
            .then(() => {
                handleRefresh();
                dispatch(getUnreadNotifications())
                setClearAllOpen(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const renderSpinner = () => {
        return <Spinner color="emerald.500" size="lg"/>;
    };

    return (
        <MainContainer style={[styles.container]}>
            <View mt={5} mb={1} style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>

                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 10,
                }}>
                    <RegularText>
                        Notifications
                    </RegularText>
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginRight: 10,
                }}>
                    <TouchableOpacity
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: 40,
                            marginBottom: 8,
                            paddingLeft: 20
                        }}
                        onPress={() => setClearAllOpen(true)}
                    >
                        <FontAwesome5 name="check" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <View mb={1} flex={1}>
                <FlatList
                    keyExtractor={() => uuid.v4()?.toString()}
                    backgroundColor={"transparent"}
                    showsVerticalScrollIndicator={false}
                    data={notifications}
                    pagingEnabled={true}
                    maxToRenderPerBatch={30}
                    onEndReachedThreshold={0.5}
                    onEndReached={loadNextPage}
                    snapToInterval={300}
                    renderItem={({item}: any) => (
                        <View mb={1}>
                            <ActivityNotification notification={item}/>
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={handleRefresh}
                            progressBackgroundColor={Colors.secondary}
                            tintColor={Colors.secondary}
                        />
                    }
                    ListFooterComponent={isLoading ? renderSpinner : null}
                    ListEmptyComponent={
                        <Center>
                            <Text style={{
                                color: Colors.secondary
                            }}>
                                No Notifications
                            </Text>
                        </Center>
                    }
                    style={styles.list}
                />
            </View>
            <OkCancelModel
                isLoading={isReduxLoading}
                modalVisible={clearAllOpen}
                setModalVisible={setClearAllOpen}
                headerText={"Mark All As Read"}
                message={"Are you sure you want to mark all notifications as read?"}
                leftButtonHandler={() => clearNotifications()}
                rightButtonHandler={() => setClearAllOpen(false)}
                leftButtonText={"Yes"}
                rightButtonText={"No"}
            />
        </MainContainer>
    );
}

export default NotificationListingScreen;
