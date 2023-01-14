import React, {useState} from "react";
import {Center, Text, View} from "native-base";
import MainContainer from "../../../components/containers/MainContainer";
import styles from "../styles";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../store";
import {UserOutput} from "../../../shared/models/users/user-output.dto";
import AccountOverviewCard from "../../../components/account-overview-card";
import {useNavigation} from "@react-navigation/native";
import {GhillieDetailDto} from "../../../shared/models/ghillies/ghillie-detail.dto";
import {PageInfo} from "../../../shared/models/pagination/types";
import {FlatList, RefreshControl, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {colorsVerifyCode} from "../../../components/colors";
import AccountTabBar from "../../../components/account-tab-bar";
import {Colors} from "../../../shared/styles";
import UserPostCard from "../../../components/user-post-card";
import postFeedService from "../../../shared/services/post-feed.service";
import {PostFeedDto} from "../../../shared/models/feed/post-feed.dto";
import {FlashList} from "@shopify/flash-list";
import {GhillieCircle} from "../../../components/ghillie-circle";
import {useStateWithCallback} from "../../../shared/hooks";
import GhillieService from "../../../shared/services/ghillie.service";
import {BookmarkPostFeedDto} from "../../../shared/models/feed/bookmarked-post-feed.dto";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import DeleteAction from "../../../components/swipe-actions/delete-action";
import postService from "../../../shared/services/post.service";
import idmeService from "../../../shared/services/idme.service";
import {getAccount} from "../../../shared/reducers/authentication.reducer";
import MessageModal from "../../../components/modals/message-modal";
import GhillieCreateOrJoin from "../../../components/ghillie-create-or-join";
import {FlashMessageRef} from "../../../components/flash-message/index";


const RenderGhillies: React.FC<{
    isLoadingGhillies: boolean;
    onGhilliePress: (ghillieId?: string) => void;
    userGhillies: GhillieDetailDto[];
    hasNextPage: boolean;
    getMoreGhillies: () => void;
    handleRefresh: () => void;
}> = ({
          isLoadingGhillies,
          onGhilliePress,
          userGhillies,
          hasNextPage,
          getMoreGhillies,
          handleRefresh
      }) => {

    const [isVerifiedMilitary, isAdmin] = useSelector(
        (state: IRootState) => [
            state.authentication.isVerifiedMilitary,
            state.authentication.isAdmin
        ]);

    return (
        <View style={styles.myGhilliesContainer}>
            <FlatList
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-around",
                    marginBottom: "3%",
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item: any) => item.id}
                data={userGhillies}
                renderItem={({item, index}: any) => (
                    <GhillieCircle
                        key={index}
                        onPress={onGhilliePress}
                        image={item.imageUrl}
                        text={item.name}
                        ghillieId={item.id}
                        height={20}
                        width={20}
                    />
                )}
                onEndReachedThreshold={0.7}
                onEndReached={() => {
                    if (hasNextPage) {
                        getMoreGhillies();
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
                ListEmptyComponent={
                    <Center>
                        <Text style={{
                            color: Colors.secondary
                        }}>No Ghillies Found</Text>
                    </Center>
                }
                ListFooterComponent={isVerifiedMilitary
                    ? (
                        <View mb="25%">
                            <GhillieCreateOrJoin/>
                        </View>
                    )
                    : null}
            />
        </View>
    );
}

const RenderPosts: React.FC<{ posts: PostFeedDto[], loadNextPage: () => void, isLoading: boolean, handleRefresh: () => void }> =
    ({
         posts,
         loadNextPage,
         isLoading,
         handleRefresh
     }) => {
        const navigation: any = useNavigation();
        const onPostPress = (postId: string) => {
            navigation.navigate("Posts", {params: {postId: postId}, screen: "PostDetail"});
        }
        return (
            <View style={styles.pastPostContainer}>
                <FlashList
                    keyExtractor={(item) => item.id}
                    data={posts}
                    onEndReachedThreshold={0.8}
                    onEndReached={loadNextPage}
                    estimatedItemSize={111}
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
                    ListFooterComponent={
                        <View mb="25%"/>
                    }
                />
            </View>
        );
    }

const RenderSaved: React.FC<{ bookmarkedPosts: BookmarkPostFeedDto[], loadNextPage: () => void, isLoading: boolean, handleRefresh: () => void }> =
    ({
         bookmarkedPosts,
         loadNextPage,
         isLoading,
         handleRefresh
     }) => {
        const navigation: any = useNavigation();
        const onPostPress = (postId: string) => {
            navigation.navigate("Posts", {params: {postId: postId}, screen: "PostDetail"});
        }

        const deleteBookmark = async (postId: string) => {
            await postService.unBookmarkPost(postId);
            handleRefresh();
        }

        const _renderDeleteAction = (postId: string) => {
            return (
                <DeleteAction onPress={() => deleteBookmark(postId)}/>
            );
        }

        return (
            <View style={styles.pastPostContainer}>
                <FlashList
                    keyExtractor={(item) => item.id}
                    data={bookmarkedPosts}
                    onEndReachedThreshold={0.8}
                    onEndReached={loadNextPage}
                    estimatedItemSize={111}
                    renderItem={({item}: any) => (
                        <Swipeable
                            renderRightActions={() => _renderDeleteAction(item.postId)}
                        >
                            <TouchableOpacity onPress={() => onPostPress(item.postId)}>
                                <UserPostCard
                                    post={item}
                                />
                            </TouchableOpacity>
                        </Swipeable>
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
                    ListFooterComponent={
                        <View mb="25%"/>
                    }
                />
            </View>
        );
    }

function AccountScreen() {
    const initialGhilliePageInfo: PageInfo = {
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
    }, setPageInfo] = useStateWithCallback<PageInfo>(initialGhilliePageInfo);
    const [isLoadingUserGhillies, setIsLoadingUserGhillies] = useStateWithCallback(false);
    const [userGhillies, setUserGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);

    // User Posts
    const [isLoadingUserPosts, setIsLoadingUserPosts] = useStateWithCallback(false);
    const [userPosts, setUserPosts] = useStateWithCallback<PostFeedDto[]>([]);
    const [postCurrentPage, setPostCurrentPage] = useStateWithCallback(1);

    // Book Marks
    const [isLoadingBookmarkedPosts, setIsLoadingBookmarkedPosts] = useStateWithCallback(false);
    const [bookmarkedPosts, setBookmarkedPosts] = useStateWithCallback<BookmarkPostFeedDto[]>([]);
    const [bookmarkedPostCurrentPage, setBookmarkedPostsCurrentPage] = useStateWithCallback(1);

    // Alert
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessageType, setModalMessageType] = useState(undefined);
    const [headerText, setHeaderText] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [buttonText, setButtonText] = useState('');

    const [tabSelection, setTabSelection] = React.useState(0);

    const dispatch = useAppDispatch();

    const myAccount: UserOutput = useSelector(
        (state: IRootState) => state.authentication.account
    );

    const navigation: any = useNavigation();

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    const showModal = (type, headerText, message, buttonText) => {
        setModalMessageType(type);
        setHeaderText(headerText);
        setModalMessage(message);
        setButtonText(buttonText);
        setModalVisible(true);
    };

    const refreshGhillieState = () => {
        setPageInfo(initialGhilliePageInfo, () => {
            setUserGhillies([], () => {
                getUserGhillies()
            });
        });
    }

    const getUserGhillies = (cursor?: string) => {
        if (!isLoadingUserGhillies && hasNextPage) {
            setIsLoadingUserGhillies(true);
            GhillieService.getCurrentUserGhillies(10, cursor)
                .then((response) => {
                    setPageInfo(response.meta);
                    if (cursor) {
                        setUserGhillies([...userGhillies, ...response.data]);
                    } else {
                        setUserGhillies(response.data);
                    }
                })
                .catch(err => {
                    FlashMessageRef.current?.showMessage({
                        message: 'An error occurred while loading your ghillies',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                })
                .finally(() => setIsLoadingUserGhillies(false));
        }
    }

    React.useEffect(() => {
        const initialLoadGhillies = navigation.addListener('focus', async () => {
            setTabSelection(0);
            refreshGhillieState();
        });

        return initialLoadGhillies;
    }, [navigation]);

    React.useEffect(() => {
        const initialMyGhilliesLoad = navigation.addListener('focus', async () => {
            getUserGhillies();
        });

        return initialMyGhilliesLoad;
    });

    React.useEffect(() => {
        if (tabSelection === 1) {
            getFeed(1)
        } else if (tabSelection === 2) {
            getBookmarkedPosts(1)
        }
    }, [tabSelection]);

    const verifyMilitaryStatus = async () => {
        try {
            const response = await idmeService.verifyMilitaryStatus();
            if (response.status === "SUCCESS") {
                showModal('success', 'Military Status Verified', response.message, 'Ok');
                dispatch(getAccount());
            } else {
                showModal('fail', 'Military Status Verification Failed', response.message, 'Ok');
            }
        } catch (error: any) {
            showModal('fail', 'Military Status Verification Failed', error.data.error.message, 'Ok');
        }
    }

    const onGhilliePress = (ghillieId?: string) => {
        moveTo("Ghillies", {screen: "GhillieDetail", params: {ghillieId: ghillieId}});
    }

    const getFeed = (page: number) => {
        setIsLoadingUserPosts(true);
        postFeedService.getUsersPosts(page, 25)
            .then(res => {
                if (page > 1) {
                    if (page === postCurrentPage) {
                        return;
                    }

                    if (res.data.length > 0) {
                        setUserPosts([...userPosts, ...res.data]);
                        setPostCurrentPage(page);
                        return;
                    }

                    setPostCurrentPage(page - 1);
                } else {
                    setUserPosts(res.data);
                    setPostCurrentPage(page);
                }
            })
            .catch(err => {
                if (page > 1) {
                    setPostCurrentPage(page - 1);
                }
            })
            .finally(() => setIsLoadingUserPosts(false));
    };

    const getBookmarkedPosts = (page: number) => {
        setIsLoadingBookmarkedPosts(true);
        postFeedService.getBookmarkedPosts(page, 25)
            .then(res => {
                if (page > 1) {
                    if (page === bookmarkedPostCurrentPage) {
                        return;
                    }

                    if (res.data.length > 0) {
                        setBookmarkedPosts([...bookmarkedPosts, ...res.data]);
                        setBookmarkedPostsCurrentPage(page);
                        return;
                    }

                    setPostCurrentPage(page - 1);
                } else {
                    setBookmarkedPosts(res.data);
                    setBookmarkedPostsCurrentPage(page);
                }
            })
            .catch(err => {
                if (page > 1) {
                    setBookmarkedPostsCurrentPage(page - 1);
                }
            })
            .finally(() => setIsLoadingBookmarkedPosts(false));
    };

    const handleRefresh = () => {
        getFeed(1);
    };

    const handleRefreshBookmarked = () => {
        getBookmarkedPosts(1);
    }

    const loadNextPage = () => {
        getFeed(postCurrentPage);
    }

    const loadNextPageBookmarked = () => {
        getBookmarkedPosts(postCurrentPage);
    }

    const onTabSelection = (selection: number) => {
        setTabSelection(selection);

        if (selection === 0) {
            getUserGhillies();
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
            <View flex={1}>
                {tabSelection === 0 && (
                    <RenderGhillies
                        isLoadingGhillies={isLoadingUserGhillies}
                        onGhilliePress={onGhilliePress}
                        userGhillies={userGhillies}
                        handleRefresh={refreshGhillieState}
                        hasNextPage={hasNextPage}
                        getMoreGhillies={() => {
                            if (hasNextPage) {
                                getUserGhillies(endCursor!);
                            }
                        }}
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
                    <RenderSaved
                        bookmarkedPosts={bookmarkedPosts}
                        handleRefresh={handleRefreshBookmarked}
                        isLoading={isLoadingBookmarkedPosts}
                        loadNextPage={loadNextPageBookmarked}
                    />
                )}
            </View>
            <MessageModal
                modalVisible={modalVisible}
                buttonHandler={() => setModalVisible(false)}
                type={modalMessageType}
                headerText={headerText}
                message={modalMessage}
                buttonText={buttonText}
            />
        </MainContainer>
    );
}

export default AccountScreen;
