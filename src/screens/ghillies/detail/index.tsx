import {useNavigation} from "@react-navigation/native";
import React, {useCallback, useEffect} from "react";
import {
    Image, RefreshControl,
    Text,
    TouchableOpacity,
    useColorScheme
} from "react-native";
import {SharedElement} from "react-navigation-shared-element";
import styles from "./styles";
import {colorsVerifyCode} from "../../../components/colors";
import {Badge, Center, Column, Row, Spinner, View} from "native-base";
import TopicsContainer from "../../../components/topics-container";
import {numberToReadableFormat} from "../../../shared/utils/number-utils";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../store";
import {getGhillie} from "../../../shared/reducers/ghillie.reducer";
import VirtualizedView from "../../../components/virtualized-view";
import PostService from "../../../shared/services/post.service";
import {PostFeedDto} from "../../../shared/models/feed/post-feed.dto";
import BigText from "../../../components/texts/big-text";
import PostFeedCard from "../../../components/post-feed-card";
import CreatePostButton from "../../../components/buttons/create-post-button";
import postReactionService from "../../../shared/services/post-reaction.service";
import {GhillieRole} from "../../../shared/models/ghillies/ghillie-role";
import {MemberStatus} from "../../../shared/models/members/member-status";
import {PostStatus} from "../../../shared/models/posts/post-status";
import {ReactionType} from "../../../shared/models/reactions/reaction-type";
import postFeedService from "../../../shared/services/post-feed.service";
import VerifiedMilitaryProtected from "../../../shared/protection/verified-military-protected";
import {GhillieStatus} from "../../../shared/models/ghillies/ghillie-status";
import GhillieService from "../../../shared/services/ghillie.service";
import {Autolink} from "../../../components/autolink";
import {PostNonFeedDto} from "../../../shared/models/posts/post-listing-non-feed.dto";
import PostNonFeedCard from "../../../components/post-non-feed-card";
import postService from "../../../shared/services/post.service";
import {Colors} from "../../../shared/styles";
import {FlashMessageRef} from "../../../components/flash-message/index";
import GhillieIcon from "../../../components/ghillie-icon";

const {primary, secondary} = colorsVerifyCode;


interface Route {
    params: {
        ghillieId: string;
    };
}

export const GhillieDetailScreen: React.FC<{ route: Route }> = ({route}) => {
    const [selection, setSelection] = React.useState(0);
    const [postCurrentPage, setPostCurrentPage] = React.useState(1);
    const [isLoadingFeed, setIsLoadingFeed] = React.useState(false);
    const [isLoadingPinned, setIsLoadingPinned] = React.useState(false);
    const [postList, setPostList] = React.useState<PostFeedDto[]>([]);
    const [pinnedPostList, setPinnedPostList] = React.useState<PostNonFeedDto[]>([]);
    const [submittingReaction, setSubmittingReaction] = React.useState(false);
    const [isLoadingOrLeaving, setIsLoadingOrLeaving] = React.useState(false);

    // eslint-disable-next-line no-unsafe-optional-chaining
    const {ghillieId} = route?.params;

    const currentUser = useSelector(
        (state: IRootState) => state.authentication.account
    );

    const ghillie = useSelector(
        (state: IRootState) => state.ghillie.ghillie
    );
    const isLoading = useSelector(
        (state: IRootState) => state.ghillie.loading
    );

    const isAdmin = useSelector(
        (state: IRootState) => state.authentication.isAdmin
    );

    const isBanned = useSelector(
        (state: IRootState) => state.ghillie.ghillie.memberMeta?.memberStatus === MemberStatus.BANNED ||
            state.ghillie.ghillie.memberMeta?.memberStatus === MemberStatus.SUSPENDED
    );

    const isMember = useSelector(
        (state: IRootState) => state.ghillie.ghillie.memberMeta !== null
    );

    const isModerator = useSelector(
        (state: IRootState) =>
            state.ghillie.ghillie.memberMeta !== null &&
            (
                state.ghillie.ghillie.memberMeta?.role === GhillieRole.OWNER ||
                state.ghillie.ghillie.memberMeta?.role === GhillieRole.MODERATOR
            )
    );

    const isVerifiedMilitary = useSelector(
        (state: IRootState) => state.authentication.isVerifiedMilitary || state.authentication.isAdmin);


    const dispatch = useAppDispatch();

    const navigation: any = useNavigation();

    useEffect(() => {
        const initialLoad = navigation.addListener('focus', async () => {
            dispatch(getGhillie(ghillieId));
            getFeed(1);
        });

        return initialLoad;
    }, [ghillieId]);

    useEffect(() => {
        if (selection === 2) {
            getPinnedPosts();
        }
    }, [selection]);

    const goBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const color = useColorScheme() === "dark" ? "#fff" : "#000";

    const onJoinGhillie = () => {
        setIsLoadingOrLeaving(true);
        GhillieService.joinGhillie(ghillieId).then(() => {
            setIsLoadingOrLeaving(false);
            dispatch(getGhillie(ghillieId));
        }).catch((err) => {
            setIsLoadingOrLeaving(false);
            FlashMessageRef.current?.showMessage({
                message: err.message,
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        });
    };

    const moderatorRemovePost = (post) => {
        PostService.updatePost(post.id, {
            status: PostStatus.REMOVED
        })
            .then(async () => {
                getFeed(1);
            })
            .catch(err => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while removing the post.',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    };

    const ownerDeletePost = async (post) => {
        try {
            await PostService.updatePost(post.id, {
                status: PostStatus.ARCHIVED
            })
            getFeed(1);
        } catch (e) {
            FlashMessageRef.current?.showMessage({
                message: 'An error occurred while deleting the post',
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }
    };

    const onHandleReaction = (postId: string, reaction: ReactionType | null) => {
        setSubmittingReaction(true);
        postReactionService.reactToPost(reaction, postId)
            .then(async () => {
                // find the post and update the reaction, set the state with the existing list of posts with updated value
                const updatedPosts = postList.map(foundPost => {
                    if (foundPost.id === postId) {
                        foundPost.currentUserReactionType = reaction;
                    }
                    return foundPost;
                });
                setPostList(updatedPosts);
                setSubmittingReaction(false);
            })
            .catch(() => {
                setSubmittingReaction(false);
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while reacting to the post.',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    const getFeed = (page: number) => {
        setIsLoadingFeed(true);
        postFeedService.getGhillieFeed(ghillieId, page, 25)
            .then(res => {
                if (page > 1) {
                    if (page === postCurrentPage) {
                        return;
                    }

                    if (res.data.length > 0) {
                        setPostList([...postList, ...res.data]);
                        setPostCurrentPage(page);
                        return;
                    }

                    setPostCurrentPage(page - 1);
                } else {
                    setPostList(res.data);
                    setPostCurrentPage(page);
                }
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: page > 1 ? 'An error occurred while loading more posts.' : 'An error occurred while loading the feed.',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                if (page > 1) {
                    setPostCurrentPage(page - 1);
                }
            })
            .finally(() => setIsLoadingFeed(false));
    };

    const loadNextPage = () => {
        getFeed(postCurrentPage)
    }

    const handleRefresh = () => {
        if (selection === 0) {
            getFeed(1);
        } else {
            getPinnedPosts();
        }
    };

    const getPinnedPosts = () => {
        setIsLoadingPinned(true);
        postService.getPinnedPostsForGhillie(ghillieId).then((res) => {
            setPinnedPostList(res);
        }).catch((err) => {
            FlashMessageRef.current?.showMessage({
                message: 'An error occurred while loading pinned posts',
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }).finally(() => setIsLoadingPinned(false));
    }
    const onPinPost = (postId: string) => {
        postService.pinPost(postId)
            .then(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'Post pinned to Ghillie',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                getPinnedPosts();
            })
            .catch(err => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while pinning the post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    const onUnpinPost = (postId: string) => {
        postService.unpinPost(postId)
            .then(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'Post unpinned from Ghillie',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                getPinnedPosts();
            })
            .catch(err => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while unpinning the post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    const _renderPost = ({item}) => (
        <PostFeedCard
            isPinnable={true}
            isGhillieMember={ghillie.memberMeta !== null}
            isVerified={isVerifiedMilitary}
            post={item}
            isModerator={isModerator}
            isAdmin={isAdmin}
            isOwner={currentUser.username === item.ownerUsername}
            onModeratorRemoval={moderatorRemovePost}
            onOwnerDelete={ownerDeletePost}
            onHandleReaction={onHandleReaction}
            isLoadingReactionUpdate={submittingReaction}
        />
    );

    const _renderPinnedPost = ({item}: { item: PostNonFeedDto }) => (
        <PostNonFeedCard
            onPinPost={onPinPost}
            onUnpinPost={onUnpinPost}
            isGhillieMember={ghillie.memberMeta !== null}
            isVerified={isVerifiedMilitary}
            post={item}
            isModerator={isModerator}
            isAdmin={isAdmin}
            isOwner={currentUser.username === item.ownerUsername}
            onModeratorRemoval={moderatorRemovePost}
            onOwnerDelete={ownerDeletePost}
            onHandleReaction={onHandleReaction}
            isLoadingReactionUpdate={submittingReaction}
        />
    );

    const _renderPostButton = () => {
        if (ghillie?.status !== GhillieStatus.ACTIVE) {
            return null;
        }
        if (ghillie?.readOnly) {
            if (isModerator) {
                return (
                    <CreatePostButton
                        style={{
                            height: 50,
                            opacity: 0.8,
                            margin: 15
                        }}
                        onPress={() => {
                            navigation.navigate("Posts", {
                                screen: "CreatePost",
                                params: {preSelectedGhillie: ghillie}
                            });
                        }}
                    />
                )
            }
            return null;
        }

        if (!isBanned && isMember) {
            return (
                <CreatePostButton
                    style={{
                        height: 50,
                        opacity: 0.8,
                        margin: 15
                    }}
                    onPress={() => {
                        navigation.navigate("Posts", {
                            screen: "CreatePost",
                            params: {preSelectedGhillie: ghillie}
                        });
                    }}
                />
            )
        }

        return null;
    }

    if (isLoading) {
        return (
            <View style={{
                flex: 1,
                backgroundColor: primary
            }}>
                <Center>
                    <Spinner color={color}/>
                </Center>
            </View>
        );
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: primary,
        }}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <GhillieIcon name="back" size={40} color={secondary}/>
            </TouchableOpacity>
            <VerifiedMilitaryProtected>
                <TouchableOpacity style={styles.updateButton}
                                  onPress={() => navigation.navigate("GhillieSettings", {ghillie})}>
                    <GhillieIcon name="cog" size={40} color={secondary}/>
                </TouchableOpacity>
            </VerifiedMilitaryProtected>
            <VirtualizedView
                isVerified={isVerifiedMilitary}
                isActive={ghillie?.status === GhillieStatus.ACTIVE}
                showsVerticalScrollIndicator={false}
                style={[styles.container, {backgroundColor: primary}]}
                contentContainerStyle={styles.contentContainer}
                renderItem={selection === 0 ? _renderPost : _renderPinnedPost}
                hideData={selection === 1}
                data={selection === 0 ? postList : pinnedPostList}
                keyExtractor={(item) => item.id}
                pagingEnabled={false}
                onEndReached={selection === 0 ? loadNextPage : undefined}
                maxToRenderPerBatch={30}
                onEndReachedThreshold={0.8}
                snapToInterval={300}
                refreshControl={
                    <RefreshControl
                        refreshing={selection === 0 ? isLoadingFeed : isLoadingPinned}
                        onRefresh={handleRefresh}
                        progressBackgroundColor={Colors.secondary}
                        tintColor={Colors.secondary}
                    />
                }
            >
                <SharedElement id={`ghillie#${ghillie}-Image`}>
                    <Image
                        style={styles.image}
                        source={
                            ghillie?.imageUrl
                                ? {uri: ghillie?.imageUrl}
                                : require("../../../../assets/logos/logo.png")
                        }
                    />
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 350,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        top: 0,
                        opacity: 0.8
                    }}/>
                </SharedElement>
                <View marginBottom={50}>
                    <Center>
                        <Text style={[styles.title, {color: colorsVerifyCode.white}]}>{ghillie?.name}</Text>
                        <Badge variant="solid" color="default">
                            {ghillie.totalMembers !== undefined && ghillie.totalMembers > 0
                                ? (
                                    <Text style={{
                                        color: "white"
                                    }}>
                                        {`${numberToReadableFormat(ghillie?.totalMembers)} members`}
                                    </Text>
                                )
                                : (
                                    <Text style={{
                                        color: "white"
                                    }}>
                                        Be the first to join!
                                    </Text>
                                )
                            }
                        </Badge>
                        <VerifiedMilitaryProtected>
                            {ghillie?.status === GhillieStatus.ACTIVE && (
                                <>
                                    {(!isBanned && !isMember) && (
                                        <TouchableOpacity
                                            style={{
                                                marginTop: 10
                                            }}
                                            disabled={isLoadingOrLeaving}
                                            onPress={() => onJoinGhillie()}
                                        >
                                            {isLoadingOrLeaving ? (
                                                <Spinner color={secondary}/>
                                            ) : (
                                                <Badge
                                                    variant="solid"
                                                    style={{
                                                        backgroundColor: secondary,
                                                        borderRadius: 10
                                                    }}
                                                >
                                                    <Text style={{
                                                        color: "white",
                                                        fontSize: 20
                                                    }}
                                                    >
                                                        Join Ghillie
                                                    </Text>
                                                </Badge>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}
                        </VerifiedMilitaryProtected>

                    </Center>
                    <Row>
                        <Column width="33%" alignItems="center">
                            <TouchableOpacity onPress={() => setSelection(0)}>
                                <GhillieIcon
                                    name="posts"
                                    size={40}
                                    color={selection === 0 ? secondary : colorsVerifyCode.white}
                                />
                                <Text style={{
                                    color: selection === 0 ? secondary : colorsVerifyCode.white
                                }}
                                >
                                    Posts
                                </Text>
                            </TouchableOpacity>
                        </Column>
                        <Column width="33%" alignItems="center">
                            <TouchableOpacity onPress={() => setSelection(1)}>
                                <GhillieIcon
                                    name="about"
                                    size={40}
                                    color={selection === 1 ? secondary : colorsVerifyCode.white}
                                />
                                <Text style={{
                                    color: selection === 1 ? secondary : colorsVerifyCode.white
                                }}
                                >
                                    About
                                </Text>
                            </TouchableOpacity>
                        </Column>
                        <Column width="33%" alignItems="center">
                            <TouchableOpacity onPress={() => setSelection(2)}>
                                <GhillieIcon
                                    name="pin"
                                    size={40}
                                    color={selection === 2 ? secondary : colorsVerifyCode.white}
                                />
                                <Text style={{
                                    color: selection === 2 ? secondary : colorsVerifyCode.white
                                }}
                                >
                                    Pinned
                                </Text>
                            </TouchableOpacity>
                        </Column>
                    </Row>
                </View>

                {
                    selection === 0 && (
                        <View>
                            {isBanned
                                ? (
                                    <Center>
                                        <Text style={{
                                            color: "white"
                                        }}
                                        >
                                            You are banned from this ghillie.
                                        </Text>
                                    </Center>
                                )
                                : (
                                    <View flex={1}>
                                        <BigText style={{
                                            marginLeft: 15,
                                            marginBottom: 10
                                        }}>
                                            Recent Posts
                                        </BigText>
                                        {_renderPostButton()}
                                    </View>
                                )}
                        </View>
                    )
                }
                {
                    selection === 1 && (
                        <>
                            <View>
                                <Text style={[styles.content, {color: colorsVerifyCode.white}]}>
                                    <Autolink
                                        text={ghillie?.about || ""}
                                        truncate={240}
                                        truncateChars="more"
                                        url
                                    />
                                </Text>
                            </View>
                            <View style={{
                                marginTop: 20,
                                borderTopWidth: 1,
                                borderTopColor: secondary,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20
                            }}>
                                <TopicsContainer topics={ghillie.topics} style={{
                                    flex: 1,
                                    marginTop: 10,
                                    marginBottom: 10
                                }}/>
                            </View>

                        </>
                    )
                }
                {
                    selection === 2 && (
                        <View>
                            {isBanned
                                ? (
                                    <Center>
                                        <Text style={{
                                            color: "white"
                                        }}
                                        >
                                            You are banned from this ghillie.
                                        </Text>
                                    </Center>
                                )
                                : (
                                    <View flex={1}>
                                        <BigText style={{
                                            marginLeft: 15,
                                            marginBottom: 10
                                        }}>
                                            Pinned Posts
                                        </BigText>
                                    </View>
                                )}
                        </View>
                    )
                }

            </VirtualizedView>
        </View>
    )
        ;
};

(GhillieDetailScreen as any).sharedElements = (route: any) => {
    return [`ghillie#-Image`];
};
