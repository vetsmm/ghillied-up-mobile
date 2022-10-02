import React from "react";
import {Center, FlatList, ScrollView, Spinner, Text, View} from "native-base";
import MainContainer from "../../../components/containers/MainContainer";
import styles from "../styles";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import {UserOutput} from "../../../shared/models/users/user-output.dto";
import AccountOverviewCard from "../../../components/account-overview-card";
import {useNavigation} from "@react-navigation/native";
import {GhillieDetailDto} from "../../../shared/models/ghillies/ghillie-detail.dto";
import ghillieService from "../../../shared/services/ghillie.service";
import {GhillieHorizontalList} from "../../../components/ghillie-horizontal-list";
import {PostListingDto} from "../../../shared/models/posts/post-listing.dto";
import {PageInfo} from "../../../shared/models/pagination/types";
import {RefreshControl, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {colorsVerifyCode} from "../../../components/colors";
import AccountTabBar from "../../../components/account-tab-bar";
import uuid from "react-native-uuid";
import PostFeedCard from "../../../components/post-feed-card";
import {Colors} from "../../../shared/styles";
import BigText from "../../../components/texts/big-text";
import UserPostCard from "../../../components/user-post-card";
import postFeedService from "../../../shared/services/post-feed.service";
import {PostFeedDto} from "../../../shared/models/feed/post-feed.dto";


function RenderGhillies({
                            isLoadingUserGhillies,
                            onGhilliePress,
                            userGhillies
                        }) {
    return isLoadingUserGhillies ? (
        <Spinner color="blue"/>
    ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
            <GhillieHorizontalList
                onGhilliePress={onGhilliePress}
                ghillieList={userGhillies}
                height={16}
                width={16}
            />
        </ScrollView>
    );
}

function RenderPosts({posts, loadNextPage, isLoading, handleRefresh}: {
    posts: PostFeedDto[],
    loadNextPage: () => void,
    isLoading: boolean,
    handleRefresh: () => void
}) {
    const navigation: any = useNavigation();
    const onPostPress = (postId: string) => {
        navigation.navigate("Posts", {params: {postId: postId}, screen: "PostDetail"});
    }
    return <FlatList
        keyExtractor={() => uuid.v4()?.toString()}
        showsVerticalScrollIndicator={false}
        data={posts}
        pagingEnabled={false}
        maxToRenderPerBatch={30}
        onEndReachedThreshold={0.8}
        onEndReached={loadNextPage}
        renderItem={({item}: any) => (
            <TouchableOpacity onPress={() => onPostPress(item.id)}>
                <UserPostCard
                    post={item}
                />
            </TouchableOpacity>
        )}
        refreshControl={
            <RefreshControl
                refreshing={isLoading}
                onRefresh={handleRefresh}
                progressBackgroundColor={Colors.secondary}
                tintColor={Colors.secondary}
            />
        }
        ListEmptyComponent={
            <Center>
                <Text style={{
                    color: Colors.secondary
                }}>
                    No Posts Found
                </Text>
            </Center>
        }
        style={styles.list}
    />;
}

function RenderSaved({}) {
    return <Text style={{
        color: colorsVerifyCode.secondary,
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center"
    }}>Coming Soon...</Text>;
}

function AccountScreen() {
    const [isLoadingUserGhillies, setIsLoadingUserGhillies] = React.useState(false);
    const [userGhillies, setUserGhillies] = React.useState<GhillieDetailDto[]>([]);

    // TODO - Circle back and add this view
    const [isLoadingUserPosts, setIsLoadingUserPosts] = React.useState(false);
    const [userPosts, setUserPosts] = React.useState<PostFeedDto[]>([]);
    const [postCurrentPage, setPostCurrentPage] = React.useState(1);
    // TODO: Add post bookmarking and add this view

    const [tabSelection, setTabSelection] = React.useState(0);

    const myAccount: UserOutput = useSelector(
        (state: IRootState) => state.authentication.account
    );

    const navigation: any = useNavigation();

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    React.useEffect(() => {
        const initialLoadGhillies = navigation.addListener('focus', async () => {
            setTabSelection(0);
            setIsLoadingUserGhillies(true);
            const {data} = await ghillieService.getCurrentUserGhillies();
            setUserGhillies(data);
            setIsLoadingUserGhillies(false);
        });

        return initialLoadGhillies;
    }, [navigation]);

    React.useEffect(() => {
        if (tabSelection === 1) {
            console.log('Loading Posts');
            getFeed(postCurrentPage)
        }
    }, [tabSelection]);

    const verifyMilitaryStatus = () => {
        console.log("Verify Military Status");
    }

    const onGhilliePress = (ghillieId?: string) => {
        moveTo("Ghillies", {screen: "GhillieDetail", params: {ghillieId: ghillieId}});
    }

    const getFeed = (page: number) => {
        setIsLoadingUserPosts(true);
        postFeedService.getUsersPosts(page, 25)
            .then(res => {
                if (res.data.length > 0) {
                    setUserPosts([...userPosts, ...res.data]);
                    setPostCurrentPage(page + 1);
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setIsLoadingUserPosts(false));
    };

    const handleRefresh = async () => {
        await getFeed(postCurrentPage);
    };

    const loadNextPage = async () => {
        setIsLoadingUserPosts(true);
        await postFeedService.getUsersPosts(postCurrentPage + 1, 25)
            .then(res => {
                setPostCurrentPage(postCurrentPage + 1);
                return setUserPosts([...userPosts, ...res.data]);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setIsLoadingUserPosts(false));
    }

    const onTabSelection = (selection: number) => {
        setTabSelection(selection);

        if (selection === 0) {
            setIsLoadingUserGhillies(true);
            ghillieService.getCurrentUserGhillies().then(({data}) => {
                setUserGhillies(data);
            });
            setIsLoadingUserGhillies(false);
        }
    }

    return (
        <MainContainer style={styles.container}>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginRight: 20,
                marginBottom: 20
            }}>
                {/* Create Icon Button, align right */}
                <TouchableOpacity onPress={() => moveTo("AccountSettings", {})}>
                    <Ionicons name="ios-cog" size={30} color={colorsVerifyCode.white}/>
                </TouchableOpacity>
            </View>
            <AccountOverviewCard
                account={myAccount}
                onVerifyClick={verifyMilitaryStatus}
            />
            <AccountTabBar selection={tabSelection} setSelection={onTabSelection}/>
            <View mt={5} flex={1}>
                {tabSelection === 0 && (
                    <RenderGhillies
                        isLoadingUserGhillies={isLoadingUserGhillies}
                        onGhilliePress={onGhilliePress}
                        userGhillies={userGhillies}
                    />
                )}
                {tabSelection === 1 && (
                    <RenderPosts
                        posts={userPosts}
                        handleRefresh={handleRefresh}
                        isLoading={isLoadingUserPosts}
                        loadNextPage={loadNextPage}
                    />
                )}
                {tabSelection === 2 && (
                    <RenderSaved/>
                )}
            </View>
        </MainContainer>
    );
}

export default AccountScreen;
