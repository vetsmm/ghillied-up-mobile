import React, {useCallback, useEffect} from 'react';
import MainContainer from '../../../components/containers/MainContainer';
import {RefreshControl, StyleSheet} from 'react-native';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';
import {Column, HStack, Icon, Text, View} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Entypo, Ionicons, MaterialIcons} from '@expo/vector-icons';
import {colorsVerifyCode} from '../../../components/colors';
import StyledSearchInput from '../../../components/inputs/styled-search-input';
import {FlashList} from '@shopify/flash-list';
import {GhillieDetailDto} from '../../../shared/models/ghillies/ghillie-detail.dto';
import GhillieService from '../../../shared/services/ghillie.service';
import {useStateWithCallback} from '../../../shared/hooks';
import GhillieCardV2 from '../../../components/ghillie-card-v2';
import {useSelector} from 'react-redux';
import {IRootState} from '../../../store';
import {useNavigation} from '@react-navigation/native';


function GhillieListingHeader({searchText, setSearchText, clearSearch, onSearchPress, navigation}) {

    const goBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <HStack style={{marginTop: 5}}>
            <Column width="12%">
                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: 50,
                        marginRight: 8,
                        paddingLeft: 15
                    }}
                    onPress={() => goBack()}
                >
                    <Ionicons name="arrow-back-circle-outline" size={30} color={colorsVerifyCode.secondary}/>
                </TouchableOpacity>
            </Column>
            <Column width="76%">
                <StyledSearchInput
                    placeholder="Search for a Ghillie"
                    placeholderTextColor={colorsVerifyCode.white}
                    value={searchText}
                    onChangeText={(e) => setSearchText(e)}
                    style={{
                        padding: 0,
                        // flex: 1,
                        height: 40,
                        marginRight: 5,
                        marginLeft: 5,
                        color: colorsVerifyCode.white
                    }}
                    returnKeyType={"search"}
                    onSubmitEditing={() => onSearchPress()}
                />
            </Column>
            <Column width="12%">
                {searchText.length > 0 && (
                    <TouchableOpacity
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: 50,
                            marginBottom: 8,
                            paddingRight: 20
                        }}
                        onPress={() => clearSearch()}
                    >
                        <MaterialIcons name="clear" size={30} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                )}
            </Column>
        </HStack>
    );
}

function GhillieSearchScreen() {

    const [searchText, setSearchText] = useStateWithCallback<string>("");
    const [ghillieList, setGhillieList] = useStateWithCallback<GhillieDetailDto[]>([]);
    const [isLoadingGhillies, setIsLoadingGhillies] = useStateWithCallback(false);

    const navigation: any = useNavigation();

    useEffect(() => {
        return navigation.addListener('focus', async () => {
            getGhillies();
        });
    }, [navigation])

    useEffect(() => {
        if (searchText.length === 0) {
            getGhillies();
        }
    }, [searchText])

    const handleCreateNavigate = useCallback(() => {
        navigation.navigate("GhillieCreate");
    }, [navigation]);

    const [isVerifiedMilitary] = useSelector(
        (state: IRootState) => [
            state.authentication.isVerifiedMilitary,
            state.authentication.isAdmin
        ]);

    const onSearchPress = () => {
        getGhillies()
    }

    const clearSearch = () => {
        setSearchText("");
    }

    const getGhillies = () => {
        if (!isLoadingGhillies) {
            setIsLoadingGhillies(true);

            const name = searchText.length > 0 ? searchText : undefined;

            GhillieService.getGhillies({take: 10, name})
                .then((response) => {
                    setGhillieList(response.data);
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => setIsLoadingGhillies(false));
        }
    }

    const handleRefresh = useCallback(() => {
        setGhillieList([], () => {
            getGhillies()
        });
    }, []);

    return (
        <MainContainer style={[styles.container]}>

            <GhillieListingHeader
                clearSearch={clearSearch}
                onSearchPress={onSearchPress}
                searchText={searchText}
                setSearchText={setSearchText}
                navigation={navigation}
            />

            <View style={styles.listContainer}>
                <FlashList
                    keyExtractor={(item) => item.id}
                    data={ghillieList}
                    estimatedItemSize={324}
                    renderItem={({item}: any) => (
                        <View mb={4}>
                            <GhillieCardV2
                                ghillie={item}
                                isVerifiedMilitary={isVerifiedMilitary}
                                onJoinPress={() => console.log("Join Pressed")}
                            />
                        </View>
                    )}
                    onRefresh={() => handleRefresh()}
                    refreshing={isLoadingGhillies}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoadingGhillies}
                            onRefresh={handleRefresh}
                            progressBackgroundColor={colorsVerifyCode.secondary}
                            tintColor={colorsVerifyCode.secondary}
                        />
                    }
                    ListFooterComponent={
                        isVerifiedMilitary ? (
                            <View alignItems={"center"} mt={10}>
                                <Text style={{
                                    color: colorsVerifyCode.white,
                                    alignSelf: "center",
                                    fontSize: 18,
                                    marginBottom: 10
                                }}>
                                    Don't See what you're looking for?
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        borderRadius: 80,
                                        borderWidth: 1,
                                        height: 50,
                                        width: 50,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: colorsVerifyCode.secondary
                                    }}
                                    onPress={() => handleCreateNavigate()}
                                >
                                    <Icon
                                        as={Entypo}
                                        name="plus"
                                        size={18}
                                        color={colorsVerifyCode.white}
                                    />
                                </TouchableOpacity>
                                <Text style={{
                                    color: colorsVerifyCode.secondary,
                                    alignSelf: "center"
                                }}>
                                    Create Ghillie
                                </Text>
                            </View>
                        ) : null}
                />
            </View>
        </MainContainer>
    )
}

export default GhillieSearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexGrow: 1,
        paddingTop: isIphoneX() ? getStatusBarHeight() + 20 : 30
    },
    listContainer: {
        flex: 1,
        flexGrow: 2,
        paddingVertical: 8,
        marginBottom: "20%"
    },
});
