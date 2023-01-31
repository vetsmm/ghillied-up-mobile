import React, {useEffect} from "react";
import styles from "./styles";
import MainContainer from "../../../components/containers/MainContainer";
import {Box, View} from "native-base";
import SmallText from "../../../components/texts/small-text";
import {FlashList} from "@shopify/flash-list";
import {ActivityIndicator, RefreshControl} from "react-native";
import {colorsVerifyCode} from "../../../components/colors";
import {SessionDto} from "../../../shared/models/sessions/session.dto";
import {useNavigation} from "@react-navigation/native";
import SessionService from "../../../shared/services/session.service";
import {CurrentSessionCard, PastSessionCard} from "./components/session-cards";
import RegularText from "../../../components/texts/regular-texts";
import {FlashMessageRef} from "../../../components/flash-message/index";
import RegularButton from "../../../components/buttons/regular-button";

export const SessionsScreen = () => {
    const [sessionList, setSessionList] = React.useState<SessionDto[]>([]);
    const [isLoadingSessions, setIsLoadingSessions] = React.useState<boolean>(false);

    const navigation: any = useNavigation();

    useEffect(() => {
        return navigation.addListener('focus', async () => {
            getSessions();
        });
    }, [navigation])

    const getSessions = async () => {
        setIsLoadingSessions(true);
        try {
            const response = await SessionService.getAllSessions({
                take: 100,
            });
            setSessionList(response);
        } catch (e: any) {
            console.log(e)
            FlashMessageRef.current?.showMessage({
                message: e?.data?.error?.message || 'Something went wrong while getting sessions',
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }
        setIsLoadingSessions(false);
    }

    const handleRefresh = () => {
        getSessions();
    }

    const onRemoveSession = async (id: string) => {
        setIsLoadingSessions(true);
        try {
            await SessionService.removeSession(id);
            setSessionList(sessionList.filter((session) => session.id !== id));
            setIsLoadingSessions(false);
        } catch (e: any) {
            console.log(e)
            setIsLoadingSessions(false);
            FlashMessageRef.current?.showMessage({
                message: e?.data?.error?.message || 'Something went wrong while removing session',
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }
    }

    const onRemoveAllPastSessions = async () => {
        setIsLoadingSessions(true);
        try {
            await SessionService.removeAllPastSessions();
            setSessionList(sessionList.filter((session) => session.isCurrentSession));
            setIsLoadingSessions(false);
        } catch (e: any) {
            setIsLoadingSessions(false);
            FlashMessageRef.current?.showMessage({
                message: e?.data?.error?.message || 'Something went wrong while removing all past sessions',
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }
    }

    const _renderCurrentSessionCard = () => {
        const currentSession = sessionList.find((session) => session.isCurrentSession)
        if (!currentSession) return null;

        return (
            <CurrentSessionCard
                session={currentSession}
            />
        )
    }

    return (
        <MainContainer style={styles.container}>
            <Box style={styles.informationBox}>
                <SmallText>
                    The locations listed for the sessions below are approximations based on where the IP address may
                    be located within the country, region, and city where the login occurred. These locations
                    can vary depending on the providers and location of the device. Other factors, such as the
                    use of VPNs, can also affect the accuracy of the location. This information should be used
                    just as a reference and not as a definitive location.
                </SmallText>
            </Box>

            <FlashList
                keyExtractor={(item) => item.id}
                // filter out the current session
                data={sessionList.filter((session) => !session.isCurrentSession)}
                estimatedItemSize={324}
                renderItem={({item}: any) => (
                    <PastSessionCard session={item} onSessionRemove={(id) => onRemoveSession(id)}/>
                )}
                onRefresh={() => handleRefresh()}
                refreshing={isLoadingSessions}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoadingSessions}
                        onRefresh={handleRefresh}
                        progressBackgroundColor={colorsVerifyCode.secondary}
                        tintColor={colorsVerifyCode.secondary}
                    />
                }
                ListHeaderComponent={
                    <>
                        <RegularText style={styles.headerText}>
                            You're signed into {sessionList.length} sessions
                        </RegularText>
                        <SmallText style={styles.currentSessionHeaderText}>Current Session</SmallText>
                        {_renderCurrentSessionCard()}

                        {sessionList.length > 1 && (
                            <>
                                <SmallText style={styles.otherActiveSessionsHeaderText}>Other active sessions</SmallText>
                                <View style={styles.endAllSessionsButtonContainer}>
                                    <RegularButton
                                        onPress={() => onRemoveAllPastSessions()}
                                        disabled={isLoadingSessions}
                                    >
                                        {isLoadingSessions
                                            ? <ActivityIndicator color={colorsVerifyCode.secondary}/>
                                            : 'End all sessions'
                                        }
                                    </RegularButton>
                                </View>
                            </>
                        )}
                    </>
                }
                ListFooterComponent={
                    <View mb="25%"/>
                }
            />
        </MainContainer>
    )
}

export default SessionsScreen;
