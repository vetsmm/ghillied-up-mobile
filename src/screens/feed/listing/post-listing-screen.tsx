import {Center, Text, View, VStack} from "native-base";
import React from "react";
import styles from "../../ghillies/listing/styles";
import MainContainer from "../../../components/containers/MainContainer";
import {RefreshControl} from "react-native";
import {Colors} from "../../../shared/styles";
import postFeedService from "../../../shared/services/post-feed.service";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import PostService from "../../../shared/services/post.service";
import postReactionService from "../../../shared/services/post-reaction.service";
import {GhillieRole} from "../../../shared/models/ghillies/ghillie-role";
import {PostStatus} from "../../../shared/models/posts/post-status";
import {ReactionType} from "../../../shared/models/reactions/reaction-type";
import {PostFeedDto} from "../../../shared/models/feed/post-feed.dto";
import PostFeedCard from "../../../components/post-feed-card";
import {useNavigation} from "@react-navigation/native";
import {FlashList} from "@shopify/flash-list";
import {SvgXml} from "react-native-svg";
import {GU_LOGO} from "../../../shared/images/logos";
import RegularText from "../../../components/texts/regular-texts";
import {useStateWithCallback} from "../../../shared/hooks";


function PostFeedHeader() {
    return (
        <View mt={5} mb={1} style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}>
                {/* Lazy way to have columns */}
            </View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
            }}>
                <VStack space={2}>
                    <SvgXml
                        style={{alignSelf: 'center'}}
                        xml={GU_LOGO}
                        height="40"
                        width="100"
                    />
                </VStack>
            </View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginRight: 10,
            }}>

            </View>
        </View>
    );
}

function PostListingScreen() {

    const [posts, setPosts] = React.useState<PostFeedDto[]>([]);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingReactionUpdate, setIsLoadingReactionUpdate] = useStateWithCallback(false);

    const navigation: any = useNavigation();

    const isModerator = useSelector(
        (state: IRootState) =>
            state.ghillie.ghillie.memberMeta !== null &&
            (
                state.ghillie.ghillie.memberMeta?.role === GhillieRole.OWNER ||
                state.ghillie.ghillie.memberMeta?.role === GhillieRole.MODERATOR
            )
    );

    const isAdmin = useSelector(
        (state: IRootState) => state.authentication.isAdmin
    );
    const currentUser = useSelector(
        (state: IRootState) => state.authentication.account
    );


    React.useEffect(() => {
        const initialLoad = navigation.addListener('focus', async () => {
            getFeed(1);
        });

        return initialLoad;
    }, [navigation]);

    const handleRefresh = () => {
        getFeed(1);
    };

    const getFeed = (page: number) => {
        setIsLoading(true);
        postFeedService.getFeed(page, 25)
            .then(res => {
                if (page > 1) {
                    if (page === currentPage) {
                        return;
                    }

                    if (res.data.length > 0) {
                        setPosts([...posts, ...res.data]);
                        setCurrentPage(page);
                        return;
                    }
                    setCurrentPage(page - 1);
                } else {
                    setPosts(res.data);
                    setCurrentPage(page);
                }
            })
            .catch(err => {
                if (page > 1) {
                    setCurrentPage(page - 1);
                }
            })
            .finally(() => setIsLoading(false));
    };

    const loadNextPage = () => {
        getFeed(currentPage)
    }

    const moderatorRemovePost = (post) => {
        PostService.updatePost(post.id, {
            status: PostStatus.REMOVED
        })
            .then(async res => {
                getFeed(1);
            })
            .catch(err => {
                // todo: handle
                console.log(err);
            });
    };

    const ownerDeletePost = (post) => {
        PostService.updatePost(post.id, {
            status: PostStatus.ARCHIVED
        })
            .then(async res => {
                getFeed(1);
            })
            .catch(err => {
                // todo: handle
                console.log(err);
            });
    };

    const getReactionCount = (updatedPost: PostFeedDto, reaction: ReactionType | null) => {
        if (reaction === null) {
            const newReactionCount = updatedPost.postReactionsCount - 1;
            return newReactionCount < 0 ? 0 : newReactionCount;
        }
        if (updatedPost.currentUserReactionId === null) {
            return updatedPost.postReactionsCount + 1;
        }

        return updatedPost.postReactionsCount;
    }

    const onHandleReaction = (postId: string, reaction: ReactionType | null) => {
        setIsLoadingReactionUpdate(true, () => {
            postReactionService.reactToPost(reaction, postId)
                .then(async res => {
                    setIsLoadingReactionUpdate(false, () => {
                        // find the post and update the reaction, set the state with the existing list of posts with updated value
                        const updatedPosts = posts.map(foundPost => {
                            if (foundPost.id === postId) {
                                foundPost.currentUserReactionType = reaction;
                                foundPost.postReactionsCount = getReactionCount(foundPost, reaction);
                            }
                            return foundPost;
                        });
                        setPosts(updatedPosts);
                    })
                })
                .catch(err => {
                    console.log(err);
                    setIsLoadingReactionUpdate(false)
                });
        });
    }

    return (
        <MainContainer style={[styles.container]}>
            <PostFeedHeader/>
            <FlashList
                keyExtractor={(item) => item.id}
                data={posts}
                onEndReachedThreshold={0.8}
                onEndReached={loadNextPage}
                estimatedItemSize={200}
                renderItem={({item}: any) => (
                    <PostFeedCard
                        post={item}
                        isModerator={isModerator}
                        isAdmin={isAdmin}
                        isOwner={currentUser.username === item.ownerUsername}
                        onModeratorRemoval={moderatorRemovePost}
                        onOwnerDelete={ownerDeletePost}
                        onHandleReaction={onHandleReaction}
                        isLoadingReactionUpdate={isLoadingReactionUpdate}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={handleRefresh}
                        progressBackgroundColor={Colors.secondary}
                        tintColor={Colors.secondary}
                    />
                }
                ListHeaderComponent={
                    <View mt={5} mb={5}>
                        <RegularText style={{
                            marginLeft: 15,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}>
                            Recent Posts
                        </RegularText>
                    </View>
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
            />
        </MainContainer>
    );
}

export default PostListingScreen;
