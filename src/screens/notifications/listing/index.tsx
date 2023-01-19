import {Center, Spinner, Text, View} from "native-base";
import React from "react";
import styles from "../../ghillies/listing/styles";
import MainContainer from "../../../components/containers/MainContainer";
import {RefreshControl, TouchableOpacity} from "react-native";
import {Colors} from "../../../shared/styles";
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
import {FlashList} from "@shopify/flash-list";
import {useStateWithCallback} from "../../../shared/hooks";
import VerifiedMilitaryProtected from "../../../shared/protection/verified-military-protected";
import {FlashMessageRef} from "../../../components/flash-message/index";
import notifee from "@notifee/react-native";

function NotificationListingScreen() {
    const [clearAllOpen, setClearAllOpen] = useStateWithCallback(false);

    const [isLoading, setIsLoading] = useStateWithCallback(false);
    const [notifications, setNotifications] = useStateWithCallback<BaseNotificationDto[]>([]);
    const [currentPage, setCurrentPage] = useStateWithCallback<number>(1);

    const isReduxLoading = useSelector(
        (state: IRootState) => state.notifications.loading
    );

    const navigation: any = useNavigation();
    const dispatch = useAppDispatch();

    // Load Initial Data
    React.useEffect(() => {
        const initialLoad = navigation.addListener('focus', async () => {
            getNotifications(1);
        });

        return initialLoad;
    }, [navigation]);

    const getNotifications = (page: number) => {
        setIsLoading(true);
        notificationService.getNotifications(page, 25)
            .then(res => {
                if (page > 1) {
                    if (page === currentPage) {
                        return;
                    }

                    if (res.data.length > 0) {
                        setNotifications([...notifications, ...res.data]);
                        setCurrentPage(page);
                        return;
                    }
                    setCurrentPage(page - 1);
                } else {
                    setNotifications(res.data);
                    setCurrentPage(page);
                }
            })
            .catch(err => {
                FlashMessageRef.current?.showMessage({
                    message: page > 1 ? "Unable to load more notifications" : "Unable to load notifications feed",
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                if (page > 1) {
                    setCurrentPage(page - 1);
                }
            })
            .finally(() => setIsLoading(false));
    }

    const handleRefresh = () => {
        getNotifications(1);
        dispatch(getUnreadNotifications());
    }

    const loadNextPage = () => {
        getNotifications(currentPage)
    }

    const clearNotifications = async () => {
        await notificationService.markAllNotificationsAsRead()
            .then(() => {
                handleRefresh();
                dispatch(getUnreadNotifications())
                setClearAllOpen(false);
                notifee.setBadgeCount(0);
            })
            .catch((error) => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while clearing notifications',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
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
                    {/* Lazy way to have columns */}
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
                    <VerifiedMilitaryProtected>
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
                            <FontAwesome5 name="check" size={30} color="white"/>
                        </TouchableOpacity>
                    </VerifiedMilitaryProtected>
                </View>
            </View>
            <View style={styles.listContainer}>
                <FlashList
                    keyExtractor={(item) => item.notificationId!}
                    showsVerticalScrollIndicator={false}
                    data={notifications}
                    onEndReachedThreshold={0.5}
                    onEndReached={loadNextPage}
                    estimatedItemSize={75}
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
                />
            </View>
            <OkCancelModel
                isLoading={isReduxLoading}
                modalVisible={clearAllOpen}
                setModalVisible={setClearAllOpen}
                headerText={"Mark All As Read"}
                message={<RegularText style={{marginBottom: 20}}>Are you sure you want to mark all notifications as read?</RegularText>}
                leftButtonHandler={() => clearNotifications()}
                rightButtonHandler={() => setClearAllOpen(false)}
                leftButtonText={"Yes"}
                rightButtonText={"No"}
            />
        </MainContainer>
    );
}

export default NotificationListingScreen;
