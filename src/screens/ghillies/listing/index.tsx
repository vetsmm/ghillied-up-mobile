import React, {useCallback} from "react";
import MainContainer from "../../../components/containers/MainContainer";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import {Center, Column, HStack, ScrollView, Spinner, Text, View} from "native-base";
import {ActivityIndicator, RefreshControl} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import {Feather, Ionicons} from "@expo/vector-icons";
import styles from "./styles";
import {Colors} from "../../../shared/styles";
import {useNavigation} from "@react-navigation/native";
import GhillieRow from "../../../components/ghillie-row";
import GhillieService from "../../../shared/services/ghillie.service";
import {GhillieDetailDto} from "../../../shared/models/ghillies/ghillie-detail.dto";
import {useStateWithCallback} from "../../../shared/hooks";
import {colorsVerifyCode} from '../../../components/colors';
import GhillieCardV2 from '../../../components/ghillie-card-v2';
import RegularText from '../../../components/texts/regular-texts';
import VerifiedMilitaryProtected from "../../../shared/protection/verified-military-protected";
import {FlashMessageRef} from "../../../app/App";
import {FlashList} from "@shopify/flash-list";

function GhillieListingHeader({isVerifiedMilitary, isAdmin}) {
    const navigation: any = useNavigation();

    const handleCreateNavigate = useCallback(() => {
        navigation.navigate("GhillieCreate");
    }, [navigation]);

    const handleSearchNavigate = useCallback(() => {
        navigation.navigate("GhillieSearch");
    }, [navigation]);

    return (
        <HStack style={{marginTop: 5}}>
            <Column width="12%">
                {(isVerifiedMilitary || isAdmin) && (
                    <TouchableOpacity
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: 40,
                            marginBottom: 8,
                            paddingLeft: 20
                        }}
                        onPress={() => handleCreateNavigate()}
                    >
                        <Ionicons name="create-outline" size={30} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                )}
            </Column>
            <Column width="76%">
            </Column>
            <Column width="12%">
                <VerifiedMilitaryProtected>
                    <TouchableOpacity
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: 40,
                            marginBottom: 8,
                            paddingRight: 20
                        }}
                        onPress={() => handleSearchNavigate()}
                    >
                        <Feather name="search" size={30} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                </VerifiedMilitaryProtected>
            </Column>
        </HStack>
    );
}

function GhillieListingScreen() {

    const [userGhillies, setUserGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);
    const [popularGhilliesByMembers, setPopularGhilliesByMembers] = useStateWithCallback<GhillieDetailDto[]>([]);
    const [trendingGhillies, setTrendingGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);
    const [newGhillies, setNewGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);

    const [isLoadingUserGhillies, setIsLoadingUserGhillies] = useStateWithCallback(false);
    const [isLoadingPopularGhillies, setIsLoadingPopularGhillies] = useStateWithCallback(false);
    const [isLoadingTrendingGhillies, setIsLoadingTrendingGhillies] = useStateWithCallback(false);
    const [isLoadingNewGhillies, setIsLoadingNewGhillies] = useStateWithCallback(false);
    const [isLoadingAll, setIsLoadingAll] = useStateWithCallback(false);

    const [isVerifiedMilitary, isAdmin] = useSelector(
        (state: IRootState) => [
            state.authentication.isVerifiedMilitary,
            state.authentication.isAdmin
        ]);

    const navigation: any = useNavigation();

    React.useEffect(() => {
        loadGhillieTypes();
    }, []);

    const loadGhillieTypes = useCallback(async () => {
        setIsLoadingAll(true);
        setIsLoadingNewGhillies(true);
        setIsLoadingPopularGhillies(true);
        setIsLoadingTrendingGhillies(true);
        setIsLoadingUserGhillies(true);

        GhillieService.getMyGhillies()
            .then((response) => {
                setUserGhillies(response.data);
                setIsLoadingUserGhillies(false);
            })
            .then(() => {
                GhillieService.getPopularGhilliesByMembers()
                    .then((response) => {
                        setPopularGhilliesByMembers(response);
                        setIsLoadingPopularGhillies(false);
                    })
                    .catch((error) => {
                        setIsLoadingPopularGhillies(false);
                        FlashMessageRef.current?.showMessage({
                            message: 'An error occurred while loading popular ghillies',
                            type: 'danger',
                            style: {
                                justifyContent: 'center',
                                alignItems: 'center',
                            }
                        });
                    });
            })
            .then(() => {
                GhillieService.getPopularGhilliesByTrendingPosts()
                    .then((response) => {
                        setTrendingGhillies(response);
                        setIsLoadingTrendingGhillies(false);
                    })
                    .catch((error) => {
                        setIsLoadingTrendingGhillies(false);
                        FlashMessageRef.current?.showMessage({
                            message: 'An error occurred while loading trending ghillies',
                            type: 'danger',
                            style: {
                                justifyContent: 'center',
                                alignItems: 'center',
                            }
                        });
                    });
            })
            .then(() => {
                GhillieService.getNewestGhillies()
                    .then((response) => {
                        setNewGhillies(response);
                        setIsLoadingNewGhillies(false);
                    })
                    .catch((error) => {
                        setIsLoadingNewGhillies(false);
                        FlashMessageRef.current?.showMessage({
                            message: 'An error occurred while loading newest ghillies',
                            type: 'danger',
                            style: {
                                justifyContent: 'center',
                                alignItems: 'center',
                            }
                        });
                    });
            })
            .catch((error) => {
                setIsLoadingUserGhillies(false);
                setIsLoadingPopularGhillies(false);
                setIsLoadingTrendingGhillies(false);
                setIsLoadingNewGhillies(false);

                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while loading your ghillies',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });

        setIsLoadingAll(false);
    }, []);

    const getMyGhillies = useCallback(() => {
        setIsLoadingUserGhillies(true);
        GhillieService.getMyGhillies()
            .then((response) => {
                setUserGhillies(response.data);
            })
            .catch((error) => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while loading your ghillies',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .finally(() => {
                setIsLoadingUserGhillies(false);
            });

    }, []);

    const getPopularGhillies = useCallback(() => {
        setIsLoadingPopularGhillies(true);
        GhillieService.getPopularGhilliesByMembers(10)
            .then((response) => {
                setPopularGhilliesByMembers(response);
            })
            .catch((error) => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while loading popular ghillies',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .finally(() => {
                setIsLoadingPopularGhillies(false);
            });
    }, []);

    // Memo to set popular ghillie state


    const getPopularGhilliesByTrendingPosts = useCallback(() => {
        setIsLoadingTrendingGhillies(true);
        return GhillieService.getPopularGhilliesByTrendingPosts(10)
            .then((response) => {
                setTrendingGhillies(response);
            })
            .catch((error) => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while loading trending ghillies',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .finally(() => {
                setIsLoadingTrendingGhillies(false);
            });
    }, []);

    const getNewestGhillies = useCallback(() => {
        setIsLoadingNewGhillies(true);
        GhillieService.getNewestGhillies(10)
            .then((response) => {
                setNewGhillies(response);
            })
            .catch((error) => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while loading newest ghillies',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .finally(() => {
                setIsLoadingNewGhillies(false);
            });
    }, []);

    const onJoinGhilliePress = (ghillie: GhillieDetailDto, list: "POPULAR" | "NEW" | "TRENDING") => {
        GhillieService.joinGhillie(ghillie.id).then(() => {
            switch (list) {
                case "POPULAR":
                    getPopularGhillies();
                    break;
                case "NEW":
                    getNewestGhillies();
                    break;
                case "TRENDING":
                    getPopularGhilliesByTrendingPosts();
                    break;
            }
        }).catch((e) => {
            FlashMessageRef.current?.showMessage({
                message: 'An error occurred while joining ghillie',
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        });
    }

    return (
        <MainContainer style={[styles.container]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        onRefresh={loadGhillieTypes}
                        refreshing={isLoadingAll}
                        tintColor={colorsVerifyCode.secondary}
                    />
                }
            >
                <GhillieListingHeader
                    isVerifiedMilitary={isVerifiedMilitary}
                    isAdmin={isAdmin}
                />

                <View mt={5}>
                    <RegularText style={{
                        marginLeft: 15,
                        fontSize: 20,
                        fontWeight: "bold",
                        marginBottom: 10
                    }}>
                        <RegularText style={{
                            marginLeft: 15,
                            fontSize: 20,
                            fontStyle: "italic",
                            fontWeight: "bold",
                            color: colorsVerifyCode.secondary,
                            marginBottom: 10
                        }}>
                            My{" "}
                        </RegularText>
                        Ghillies
                    </RegularText>
                    {isLoadingUserGhillies ? (
                        <View style={{alignItems: "center"}}>
                            <ActivityIndicator size="large" color={colorsVerifyCode.secondary}/>
                        </View>
                    ) : (
                        <GhillieRow
                            ghillieList={userGhillies}
                            onPress={ghillie => {
                                navigation.navigate("GhillieDetail", {ghillieId: ghillie.id});
                            }}
                        />
                    )}

                </View>

                <View mb={40}>
                    <View style={styles.popularContainer}>
                        <RegularText style={{
                            marginLeft: 15,
                            fontSize: 20,
                            fontWeight: "bold",
                            marginBottom: 10
                        }}>
                            <RegularText style={{
                                marginLeft: 15,
                                fontSize: 20,
                                fontStyle: "italic",
                                fontWeight: "bold",
                                color: colorsVerifyCode.secondary,
                                marginBottom: 10
                            }}>
                                Popular{" "}
                            </RegularText>
                            Ghillies
                        </RegularText>
                        {isLoadingPopularGhillies ? (
                            <View style={{alignItems: "center"}}>
                                <ActivityIndicator size="large" color={colorsVerifyCode.secondary}/>
                            </View>
                        ) : (
                            <FlashList
                                horizontal={true}
                                estimatedItemSize={300}
                                nestedScrollEnabled={true}
                                contentContainerStyle={{
                                    paddingLeft: 15,
                                    paddingRight: 15
                                }}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                data={popularGhilliesByMembers}
                                renderItem={({item}: any) => (
                                    <View mr={2}>
                                        <GhillieCardV2
                                            ghillie={item}
                                            isVerifiedMilitary={isVerifiedMilitary}
                                            onJoinPress={() => onJoinGhilliePress(item, "POPULAR")}
                                            isMember={item.memberMeta !== null}
                                        />
                                    </View>
                                )}
                                refreshing={isLoadingPopularGhillies}
                                ListEmptyComponent={
                                    <Center>
                                        <Text style={{
                                            color: Colors.secondary
                                        }}>No Ghillies Found</Text>
                                    </Center>
                                }
                            />
                        )}
                    </View>

                    <View style={styles.listContainer}>
                        <RegularText style={{
                            marginLeft: 15,
                            fontSize: 20,
                            fontWeight: "bold",
                            marginBottom: 10
                        }}>
                            <RegularText style={{
                                marginLeft: 15,
                                fontSize: 20,
                                fontStyle: "italic",
                                fontWeight: "bold",
                                color: colorsVerifyCode.secondary,
                                marginBottom: 10
                            }}>
                                Trending{" "}
                            </RegularText>
                            Ghillies
                        </RegularText>
                        {isLoadingTrendingGhillies ? (
                            <View style={{alignItems: "center"}}>
                                <ActivityIndicator size="large" color={colorsVerifyCode.secondary}/>
                            </View>
                        ) : (
                            <FlashList
                                horizontal={true}
                                estimatedItemSize={300}
                                contentContainerStyle={{
                                    paddingLeft: 15,
                                    paddingRight: 15
                                }}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                data={trendingGhillies}
                                renderItem={({item}: any) => (
                                    <View key={item.id} mb={2} mr={2}>
                                        <GhillieCardV2
                                            ghillie={item}
                                            onJoinPress={() => onJoinGhilliePress(item, "TRENDING")}
                                            isVerifiedMilitary={isVerifiedMilitary}
                                            isMember={item.memberMeta !== null}
                                        />
                                    </View>
                                )}
                                refreshing={isLoadingTrendingGhillies}
                                ListEmptyComponent={
                                    <Center>
                                        <Text style={{
                                            color: Colors.secondary
                                        }}>No Ghillies Found</Text>
                                    </Center>
                                }
                            />
                        )}
                    </View>

                    <View style={styles.popularContainer}>
                        <RegularText style={{
                            marginLeft: 15,
                            fontSize: 20,
                            fontWeight: "bold",
                            marginBottom: 10
                        }}>
                            <RegularText style={{
                                marginLeft: 15,
                                fontSize: 20,
                                fontStyle: "italic",
                                fontWeight: "bold",
                                color: colorsVerifyCode.secondary,
                                marginBottom: 10
                            }}>
                                New{" "}
                            </RegularText>
                            Ghillies
                        </RegularText>
                        {isLoadingNewGhillies ? (
                            <View style={{alignItems: "center"}}>
                                <ActivityIndicator size="large" color={colorsVerifyCode.secondary}/>
                            </View>
                        ) : (
                            <FlashList
                                horizontal={true}
                                estimatedItemSize={300}
                                contentContainerStyle={{
                                    paddingLeft: 15,
                                    paddingRight: 15
                                }}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                data={newGhillies}
                                // estimatedItemSize={327}
                                renderItem={({item}: any) => (
                                    <View key={item.id} mr={2}>
                                        <GhillieCardV2
                                            ghillie={item}
                                            onJoinPress={() => onJoinGhilliePress(item, "NEW")}
                                            isVerifiedMilitary={isVerifiedMilitary}
                                            isMember={item.memberMeta !== null}
                                        />
                                    </View>
                                )}
                                refreshing={isLoadingNewGhillies}
                                ListEmptyComponent={
                                    <Center>
                                        <Text style={{
                                            color: Colors.secondary
                                        }}>No Ghillies Found</Text>
                                    </Center>
                                }
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </MainContainer>
    );
}

export default GhillieListingScreen;
