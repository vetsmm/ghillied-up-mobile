import React, {useCallback} from "react";
import MainContainer from "../../../components/containers/MainContainer";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import {Center, Column, HStack, ScrollView, Text, View} from "native-base";
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
import GhillieCreateOrJoin from "../../../components/ghillie-create-or-join";

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
    const [internalGhillies, setInternalGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);
    const [promotedGhillies, setPromotedGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);
    const [sponsoredGhillies, setSponsoredGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);

    const [isLoadingAll, setIsLoadingAll] = useStateWithCallback(false);

    const [isVerifiedMilitary, isAdmin] = useSelector(
        (state: IRootState) => [
            state.authentication.isVerifiedMilitary,
            state.authentication.isAdmin
        ]);

    const navigation: any = useNavigation();

    React.useEffect(() => {
        loadCombinedGhillies();
    }, []);

    const loadCombinedGhillies = useCallback(async () => {
        setIsLoadingAll(true);
        GhillieService.getCombinedGhillies()
            .then((response) => {
                setPopularGhilliesByMembers(response.popularByMembers);
                setTrendingGhillies(response.popularByTrending);
                setNewGhillies(response.newest);
                setInternalGhillies(response.internal);
                setPromotedGhillies(response.promoted);
                setSponsoredGhillies(response.sponsored);
                setUserGhillies(response.users);
                setIsLoadingAll(false);
            })
            .catch((error) => {
                setIsLoadingAll(false);
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while loading ghillies',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }, []);

    const onJoinGhilliePress = (ghillie: GhillieDetailDto, list: "POPULAR" | "NEW" | "TRENDING") => {
        GhillieService.joinGhillie(ghillie.id).then(() => {
            // TODO: We should actually return the memberMeta here and plug it into the correct ghillie
            //  in the list. For now, we'll just reload the list.
            loadCombinedGhillies();
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
                        onRefresh={loadCombinedGhillies}
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
                    {isLoadingAll ? (
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
                    {/* Internal Ghillies */}
                    <View style={styles.internalGhillieContainer}>
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
                                Base{" "}
                            </RegularText>
                            Ghillies
                        </RegularText>
                        {isLoadingAll ? (
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
                                data={internalGhillies}
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
                                refreshing={isLoadingAll}
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
                                Popular{" "}
                            </RegularText>
                            Ghillies
                        </RegularText>
                        {isLoadingAll ? (
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
                                refreshing={isLoadingAll}
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
                        {isLoadingAll ? (
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
                                refreshing={isLoadingAll}
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
                        {isLoadingAll ? (
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
                                refreshing={isLoadingAll}
                                ListEmptyComponent={
                                    <Center>
                                        <Text style={{
                                            color: Colors.secondary
                                        }}>No Ghillies Found</Text>
                                    </Center>
                                }
                            />
                        )}

                        {isVerifiedMilitary
                            ? <GhillieCreateOrJoin/>
                            : null}
                    </View>
                </View>
            </ScrollView>
        </MainContainer>
    );
}

export default GhillieListingScreen;
