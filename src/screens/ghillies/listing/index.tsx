import React, {useCallback} from "react";
import MainContainer from "../../../components/containers/MainContainer";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import {Center, Column, HStack, Text, View} from "native-base";
import {RefreshControl} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import styles from "./styles";
import {SearchInput} from "../../../components/search";
import {GhillieCard} from "../../../components/cards/ghillie-listing";
import {Colors} from "../../../shared/styles";
import {useNavigation} from "@react-navigation/native";
import GhillieRow from "../../../components/ghillie-row";
import BigText from "../../../components/texts/big-text";
import GhillieService from "../../../shared/services/ghillie.service";
import {GhillieDetailDto} from "../../../shared/models/ghillies/ghillie-detail.dto";
import {useStateWithCallback} from "../../../shared/hooks";
import {FlashList} from "@shopify/flash-list";
import {PageInfo} from "../../../shared/models/pagination/types";

function GhillieListingHeader({searchText, setSearchText, clearSearch, isVerifiedMilitary, isAdmin}) {
    const navigation: any = useNavigation();

    const handleNavigate = useCallback(() => {
        navigation.navigate("GhillieCreate");
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
                        onPress={() => handleNavigate()}
                    >
                        <Ionicons name="create-outline" size={30} color="white"/>
                    </TouchableOpacity>
                )}
            </Column>
            <Column width="76%">
                <SearchInput
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </Column>
            <Column width="12%">
                {searchText.length > 0 && (
                    <TouchableOpacity
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: 40,
                            marginBottom: 8,
                            paddingRight: 20
                        }}
                        onPress={() => clearSearch()}
                    >
                        <MaterialIcons name="clear" size={30} color="white"/>
                    </TouchableOpacity>
                )}
            </Column>
        </HStack>
    );
}

function GhillieListingScreen() {

    const initialPageInfo: PageInfo = {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null
    }
    const [{
        startCursor,
        endCursor,
        hasNextPage,
        hasPreviousPage
    }, setPageInfo] = useStateWithCallback<PageInfo>(initialPageInfo);
    const [userGhillies, setUserGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);
    const [ghillieList, setGhillieList] = useStateWithCallback<GhillieDetailDto[]>([]);

    const [searchText, setSearchText] = useStateWithCallback("");
    const [isLoadingUserGhillies, setIsLoadingUserGhillies] = useStateWithCallback(false);
    const [isLoadingGhillies, setIsLoadingGhillies] = useStateWithCallback(false);

    const [isVerifiedMilitary, isAdmin] = useSelector(
        (state: IRootState) => [
            state.authentication.isVerifiedMilitary,
            state.authentication.isAdmin
        ]);

    const navigation: any = useNavigation();

    const refreshGhillieState = () => {
        setPageInfo(initialPageInfo, () => {
            setGhillieList([], () => {
                getGhillies()
            });
        });
        setUserGhillies([], () => {
            getMyGhillies()
        });
    }
    React.useEffect(() => {
        const initialLoad = navigation.addListener('focus', async () => {
            refreshGhillieState()
        });

        return initialLoad;
    }, [navigation]);

    const handleRefresh = useCallback(() => {
        setPageInfo(initialPageInfo, () => {
            setGhillieList([], () => {
                getGhillies()
            });
        });
    }, []);

    const getMyGhillies = useCallback(() => {
        setIsLoadingUserGhillies(true);
        GhillieService.getMyGhillies()
            .then((response) => {
                setUserGhillies(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoadingUserGhillies(false);
            });

    }, []);

    const getGhillies = (cursor?: string) => {
        if (!isLoadingGhillies && hasNextPage) {
            setIsLoadingGhillies(true);
            GhillieService.getGhillies({cursor: cursor, take: 10})
                .then((response) => {
                    setPageInfo(response.meta);
                    if (cursor) {
                        setGhillieList([...ghillieList, ...response.data]);
                    } else {
                        setGhillieList(response.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => setIsLoadingGhillies(false));
        }
    }

    return (
        <MainContainer style={[styles.container]}>
            <GhillieListingHeader
                isVerifiedMilitary={isVerifiedMilitary}
                isAdmin={isAdmin}
                searchText={searchText}
                setSearchText={setSearchText}
                clearSearch={() => {
                    setSearchText("");
                    getGhillies();
                }}
            />

            <View mt={5}>
                <BigText style={{
                    marginLeft: 15,
                }}>
                    My Ghillies
                </BigText>
                <GhillieRow
                    ghillieList={userGhillies}
                    onPress={ghillie => {
                        navigation.navigate("GhillieDetail", {ghillieId: ghillie.id});
                    }}
                />
            </View>

            <View style={styles.listContainer}>
                <FlashList
                    keyExtractor={(item) => item.id}
                    data={ghillieList}
                    estimatedItemSize={120}
                    renderItem={({item, index}: any) => (
                        <GhillieCard ghillie={item} index={index}/>
                    )}
                    onEndReachedThreshold={0.7}
                    onEndReached={() => {
                        if (hasNextPage) {
                            getGhillies(endCursor!);
                        }
                    }}
                    onRefresh={() => handleRefresh()}
                    refreshing={isLoadingGhillies}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoadingGhillies}
                            onRefresh={handleRefresh}
                            progressBackgroundColor={Colors.secondary}
                            tintColor={Colors.secondary}
                        />
                    }
                    ListHeaderComponent={
                        <View mt={5} mb={5}>
                            <BigText style={{
                                marginLeft: 15,
                            }}>
                                Explore Ghillies
                            </BigText>
                        </View>
                    }
                    ListEmptyComponent={
                        <Center>
                            <Text style={{
                                color: Colors.secondary
                            }}>No Ghillies Found</Text>
                        </Center>
                    }
                />
            </View>
        </MainContainer>
    );
}

export default GhillieListingScreen;
