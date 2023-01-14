import {Button, Center, HStack, ScrollView, Text, View, VStack} from "native-base";
import React, {useCallback} from "react";
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
import {GhillieDetailDto} from '../../../shared/models/ghillies/ghillie-detail.dto';
import GhillieService from '../../../shared/services/ghillie.service';
import {GhillieCircle} from '../../../components/ghillie-circle';
import VerifiedMilitaryProtected from "../../../shared/protection/verified-military-protected";
import {colorsVerifyCode} from "../../../components/colors";
import {FlashMessageRef} from "../../../components/flash-message/index";


function PostFeedHeader() {
    return (
        <View mt={5} style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}>
                {/* Lazy way to have columns */}
            </View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10
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
                marginRight: 10
            }}>

            </View>
        </View>
    );
}

function PostListingScreen() {

    const [posts, setPosts] = React.useState<PostFeedDto[]>([]);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [isLoading, setIsLoading] = React.useState(false);
    const [submittingReaction, setSubmittingReaction] = React.useState(false);
    const [userGhillies, setUserGhillies] = useStateWithCallback<GhillieDetailDto[]>([]);
    const [isLoadingUserGhillies, setIsLoadingUserGhillies] = useStateWithCallback(false);
    const [selectedGhillie, setSelectedGhillie] = useStateWithCallback<GhillieDetailDto | undefined>(undefined);

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
        setSelectedGhillie(undefined);
        getFeed(1);
        getMyGhillies();
    }, []);

    React.useEffect(() => {
        if (selectedGhillie) {
            getGhillieFeed(1);
        } else {
            getFeed(1);
        }
    }, [selectedGhillie]);

    const handleRefresh = () => {
        if (selectedGhillie) {
            getGhillieFeed(1);
        } else {
            getFeed(1);
        }
    };

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

    const getGhillieFeed = (page: number) => {
        setIsLoading(true);
        postFeedService.getGhillieFeed(selectedGhillie!.id, 1)
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
                FlashMessageRef.current?.showMessage({
                    message: page > 1 ? 'An error occurred while loading more posts' : 'An error occurred while loading the feed',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                if (page > 1) {
                    setCurrentPage(page - 1);
                }
            })
            .finally(() => setIsLoading(false));
    }

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
                FlashMessageRef.current?.showMessage({
                    message: page > 1 ? 'An error occurred while loading more posts' : 'An error occurred while loading the feed',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                if (page > 1) {
                    setCurrentPage(page - 1);
                }
            })
            .finally(() => setIsLoading(false));
    };

    const loadNextPage = () => {
        if (selectedGhillie) {
            getGhillieFeed(currentPage);
        } else {
            getFeed(currentPage)
        }
    }

    const moderatorRemovePost = (post) => {
        PostService.updatePost(post.id, {
            status: PostStatus.REMOVED
        })
            .then(() => {
                if (selectedGhillie) {
                    getGhillieFeed(1);
                } else {
                    getFeed(1);
                }
            })
            .catch(err => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while removing the post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    };

    const ownerDeletePost = (post) => {
        PostService.updatePost(post.id, {
            status: PostStatus.ARCHIVED
        })
            .then(() => {
                if (selectedGhillie) {
                    getGhillieFeed(1);
                } else {
                    getFeed(1);
                }
            })
            .catch(err => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while deleting the post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
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
        setSubmittingReaction(true);
        postReactionService.reactToPost(reaction, postId)
            .then(async () => {
                const updatedPosts = posts.map(foundPost => {
                    if (foundPost.id === postId) {
                        foundPost.currentUserReactionType = reaction;
                        foundPost.postReactionsCount = getReactionCount(foundPost, reaction);
                    }
                    return foundPost;
                });
                setPosts(updatedPosts);
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while reacting to the post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
        setSubmittingReaction(false);
    }

    return (
        <MainContainer style={[styles.container]}>
            <PostFeedHeader/>

            {selectedGhillie ? (
                <Center mt={2}>
                    <GhillieCircle
                        image={selectedGhillie.imageUrl}
                        onPress={() => {
                            setSelectedGhillie(undefined);
                        }}
                        text={selectedGhillie.name}
                    />
                </Center>
            ) : (
                <View mb={2}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <HStack width="100%" py={{base: 3, md: 4}}>
                            {userGhillies.map((ghillie, index) => (
                                <GhillieCircle
                                    key={index}
                                    image={ghillie.imageUrl}
                                    onPress={() => setSelectedGhillie(ghillie)}
                                    text={ghillie.name}
                                />
                            ))}
                        </HStack>
                    </ScrollView>
                </View>
            )}

            <View style={{flex: 1}}>
                <VerifiedMilitaryProtected
                    unverifiedComponent={
                        <View
                            flex={1}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <RegularText style={{
                                textAlign: "center",
                                fontSize: 18,
                            }}>
                                Thanks for joining! To participate in the community, you must verify your military status.
                                This helps us keep the community safe and secure.
                            </RegularText>
                            <Button
                                style={{
                                    marginTop: 10,
                                    marginBottom: 10,
                                    borderRadius: 20,
                                }}
                                color={colorsVerifyCode.accent}
                                onPress={() => navigation.navigate("Account", {screen: "MyAccount"})}
                            >
                                <Text style={{
                                    color: "white",
                                    fontSize: 20
                                }}
                                >
                                    Verify Military Status
                                </Text>
                            </Button>
                        </View>
                    }
                >
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
                                isLoadingReactionUpdate={submittingReaction}
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
                            <View mb={5}>
                                <RegularText style={{
                                    marginLeft: 15,
                                    fontSize: 20,
                                    fontWeight: 'bold'
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
                </VerifiedMilitaryProtected>
            </View>
        </MainContainer>
    );
}

export default PostListingScreen;
