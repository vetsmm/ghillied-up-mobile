import {useNavigation} from "@react-navigation/native";
import React, {useCallback, useEffect} from "react";
import {
    Image,
    Text,
    TouchableOpacity,
    useColorScheme
} from "react-native";
import {SharedElement} from "react-navigation-shared-element";
import styles from "./styles";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {colorsVerifyCode} from "../../../components/colors";
import {Badge, Center, Column, Row, Spinner, View} from "native-base";
import TopicsContainer from "../../../components/topics-container";
import {numberToReadableFormat} from "../../../shared/utils/number-utils";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../store";
import {getGhillie, joinGhillie, leaveGhillie} from "../../../shared/reducers/ghillie.reducer";
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

const {primary, secondary, fail} = colorsVerifyCode;


interface Route {
    params: {
        ghillieId: string;
        ghillieIndex: number;
    };
}

export const GhillieDetailScreen: React.FC<{ route: Route }> = ({route}) => {
    const [selection, setSelection] = React.useState(0);
    const [postCurrentPage, setPostCurrentPage] = React.useState(1);
    const [isLoadingGhillies, setIsLoadingGhillies] = React.useState(false);
    const [postList, setPostList] = React.useState<PostFeedDto[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = React.useState(false);

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

    const isGhillieOwner = useSelector(
        (state: IRootState) => state.ghillie.ghillie.memberMeta?.role === GhillieRole.OWNER
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


    // eslint-disable-next-line no-unsafe-optional-chaining
    const {ghillieId} = route?.params;

    const dispatch = useAppDispatch();

    useEffect(() => {
        const initialLoad = navigation.addListener('focus', async () => {
            dispatch(getGhillie(ghillieId));
            getFeed(1);
        });

        return initialLoad;
    }, [dispatch, ghillieId]);

    const navigation: any = useNavigation();

    const goBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleGhillieUpdate = useCallback(() => {
        navigation.navigate("GhillieUpdate", {ghillie});
    }, [navigation, ghillie]);

    const color = useColorScheme() === "dark" ? "#fff" : "#000";

    const onGhillieJoinOrLeave = () => {
        if (ghillie.memberMeta) {
            dispatch(leaveGhillie(ghillieId));
        } else {
            dispatch(joinGhillie(ghillieId));
        }
    };

    const moderatorRemovePost = (post) => {
        PostService.updatePost(post.id, {
            status: PostStatus.REMOVED
        })
            .then(async () => {
                getFeed(1);
            })
            .catch(err => {
                // todo: handle
                console.log(err);
            });
    };

    const ownerDeletePost = async (post) => {
        try {
            await PostService.updatePost(post.id, {
                status: PostStatus.ARCHIVED
            })
            getFeed(1);
        } catch (e) {
            console.log(e);
        }
    };

    const onHandleReaction = (postId: string, reaction: ReactionType | null) => {
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
            })
            .catch(err => {
                console.log(`Error while reacting to post: ${err}`);
            });
    }


    const getFeed = (page: number) => {
        setIsLoadingGhillies(true);
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
            .catch(err => {
                if (page > 1) {
                    setPostCurrentPage(page - 1);
                }
            })
            .finally(() => setIsLoadingGhillies(false));
    };

    const loadNextPage = () => {
        getFeed(postCurrentPage)
    }

    const _renderPost = ({item}) => (
        <PostFeedCard
            post={item}
            isModerator={isModerator}
            isAdmin={isAdmin}
            isOwner={currentUser.username === item.ownerUsername}
            onModeratorRemoval={moderatorRemovePost}
            onOwnerDelete={ownerDeletePost}
            onHandleReaction={onHandleReaction}
        />
    );

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
            backgroundColor: primary
        }}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Ionicons name="arrow-back-circle-outline" size={40} color={secondary}/>
            </TouchableOpacity>
            {(isAdmin || isGhillieOwner) && (
                <TouchableOpacity style={styles.updateButton} onPress={handleGhillieUpdate}>
                    <Ionicons name="cog" size={40} color={secondary}/>
                </TouchableOpacity>
            )}
            <VirtualizedView
                showsVerticalScrollIndicator={false}
                style={[styles.container, {backgroundColor: primary}]}
                contentContainerStyle={styles.contentContainer}
                renderItem={_renderPost}
                hideData={selection === 1}
                data={postList}
                keyExtractor={(item) => item.id}
                pagingEnabled={false}
                onEndReached={loadNextPage}
                maxToRenderPerBatch={30}
                onEndReachedThreshold={0.8}
                snapToInterval={300}
            >
                <SharedElement id={`ghillie#${ghillie}-Image`}>
                    <Image
                        style={styles.image}
                        source={
                            ghillie?.imageUrl
                                ? {uri: ghillie?.imageUrl}
                                : require("../../../../assets/logos/logo.png")
                        }
                        // resizeMode={"cover"}
                    />
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
                        <TouchableOpacity
                            style={{
                                marginTop: 10
                            }}
                            disabled={isBanned}
                            onPress={() => onGhillieJoinOrLeave()}
                        >
                            <Badge
                                variant="solid"
                                style={{
                                    backgroundColor: !ghillie.memberMeta ? secondary : fail,
                                    borderRadius: 10
                                }}
                            >
                                <Text style={{
                                    color: "white",
                                    fontSize: 20
                                }}
                                >
                                    {!ghillie.memberMeta
                                        ? "Join Ghillie"
                                        : isBanned ? "Banned" : "Leave Ghillie"
                                    }
                                </Text>
                            </Badge>
                        </TouchableOpacity>
                    </Center>
                    <Row>
                        <Column width="50%" alignItems="center">
                            <TouchableOpacity onPress={() => setSelection(0)}>
                                <FontAwesome
                                    name={selection === 0 ? "comments" : "comments-o"}
                                    size={40}
                                    color={secondary}
                                />
                                <Text style={{
                                    color: secondary
                                }}
                                >
                                    Posts
                                </Text>
                            </TouchableOpacity>
                        </Column>
                        <Column width="50%" alignItems="center">
                            <TouchableOpacity onPress={() => setSelection(1)}>
                                <FontAwesome
                                    name={selection === 1 ? "question-circle" : "question-circle-o"}
                                    size={40}
                                    color={secondary}
                                />
                                <Text style={{
                                    color: secondary
                                }}
                                >
                                    About
                                </Text>
                            </TouchableOpacity>
                        </Column>
                    </Row>
                </View>

                {selection === 0 && (
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
                                    {(!isBanned && isMember) && (
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
                                    )}
                                    {/* TODO: Add create post for this ghillie */}
                                    {/* TODO: Add pinned posts, ** REQUIRES DATA CHANGE ** */}
                                </View>
                            )}
                    </View>
                )}
                {selection === 1 && (
                    <>
                        <View>
                            <Text style={[styles.content, {color: colorsVerifyCode.white}]}>
                                {ghillie?.about}
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
                )}

            </VirtualizedView>
        </View>
    );
};

(GhillieDetailScreen as any).sharedElements = (route: any) => {
    const {ghillieIndex} = route.params;
    return [`ghillie#${ghillieIndex}-Image`];
};
