import React, {useCallback, useEffect} from 'react';
import MainContainer from '../../../components/containers/MainContainer';
import {RefreshControl, StyleSheet} from 'react-native';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';
import {Center, Column, HStack, Icon, Text, View} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
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
import GhillieCreateOrJoin from "../../../components/ghillie-create-or-join";
import {GhillieCategory} from "../../../shared/models/ghillies/ghillie-category";
import GhillieCategoryCircle from "../../../components/ghillie-category-circle";
import GhillieCategoryRow from "../../../components/ghillie-category-row";
import RegularText from "../../../components/texts/regular-texts";
import {FlashMessageRef} from "../../../components/flash-message/index";


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
    const [selectedCategory, setSelectedCategory] = React.useState<GhillieCategory>();

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

    useEffect(() => {
        getGhillies();
    }, [selectedCategory])

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

    const onJoinGhilliePress = (ghillie: GhillieDetailDto) => {
        GhillieService.joinGhillie(ghillie.id).then(() => {
            navigation.navigate("GhillieDetail", {ghillieId: ghillie.id});
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

    const getGhillies = () => {
        if (!isLoadingGhillies) {
            setIsLoadingGhillies(true);

            const name = searchText.length > 0 ? searchText : undefined;

            GhillieService.getGhillies({take: 10, name, category: selectedCategory})
                .then((response) => {
                    setGhillieList(response.data);
                })
                .catch(err => {
                    FlashMessageRef.current?.showMessage({
                        message: 'An error occurred while loading ghillies',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
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
                <View mt="2%" mb="2%">
                    <RegularText style={{
                        marginLeft: 15,
                        fontSize: 20,
                        fontWeight: "bold",
                        marginBottom: 10
                    }}>
                        Ghillie Categories
                    </RegularText>
                    {selectedCategory && (
                        <Center>
                            <GhillieCategoryCircle
                                onPress={() => setSelectedCategory(undefined)}
                                category={selectedCategory}
                            />
                        </Center>
                    )}
                    {!selectedCategory && (
                        <GhillieCategoryRow
                            onPress={(category => setSelectedCategory(category))}
                        />
                    )}
                </View>

                <FlashList
                    keyExtractor={(item) => item.id}
                    data={ghillieList}
                    estimatedItemSize={324}
                    renderItem={({item}: any) => (
                        <View mb={4}>
                            <GhillieCardV2
                                ghillie={item}
                                isVerifiedMilitary={isVerifiedMilitary}
                                onJoinPress={() => onJoinGhilliePress(item)}
                                isMember={item.memberMeta !== null}
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
                            <GhillieCreateOrJoin/>
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
