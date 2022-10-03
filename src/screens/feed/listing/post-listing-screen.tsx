import {Center, Column, FlatList, HStack, Spinner, Text, View} from "native-base";
import React, {useEffect} from "react";
import styles from "../../ghillies/listing/styles";
import MainContainer from "../../../components/containers/MainContainer";
import uuid from "react-native-uuid";
import {RefreshControl} from "react-native";
import {Colors} from "../../../shared/styles";
import BigText from "../../../components/texts/big-text";
import postFeedService from "../../../shared/services/post-feed.service";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import PostService from "../../../shared/services/post.service";
import {TouchableOpacity} from "react-native-gesture-handler";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {SearchInput} from "../../../components/search";
import postReactionService from "../../../shared/services/post-reaction.service";
import {GhillieRole} from "../../../shared/models/ghillies/ghillie-role";
import {PostStatus} from "../../../shared/models/posts/post-status";
import {ReactionType} from "../../../shared/models/reactions/reaction-type";
import {PostFeedDto} from "../../../shared/models/feed/post-feed.dto";
import PostFeedCard from "../../../components/post-feed-card";
import {useNavigation} from "@react-navigation/native";


function PostFeedHeader({searchText, setSearchText, clearSearch, onFilterClick}) {
    return (
        <HStack style={{marginTop: 5}}>
            <Column width="12%">
                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                        marginBottom: 8,
                        paddingLeft: 20
                    }}
                    onPress={() => onFilterClick()}
                >
                    <Ionicons name="filter" size={30} color="white"/>
                </TouchableOpacity>
            </Column>
            <Column width="76%">
                <SearchInput
                    placeholder={"Search Posts..."}
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

function PostListingScreen(props: any) {

    const [posts, setPosts] = React.useState<PostFeedDto[]>([]);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchText, setSearchText] = React.useState("");

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

    const handleRefresh = async () => {
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
        postReactionService.reactToPost(reaction, postId)
            .then(async res => {
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
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <MainContainer style={[styles.container]}>
            <PostFeedHeader
                clearSearch={async () => {
                    setSearchText("");
                    getFeed(1);
                }}
                // TODO: Do something with the search
                searchText={searchText}
                setSearchText={setSearchText}
                onFilterClick={() => {
                    // TODO: Implement filter screen
                    console.log("onFilter")
                }}
            />
            <FlatList
                keyExtractor={() => uuid.v4()?.toString()}
                showsVerticalScrollIndicator={false}
                data={posts}
                pagingEnabled={false}
                maxToRenderPerBatch={30}
                onEndReachedThreshold={0.8}
                onEndReached={loadNextPage}
                renderItem={({item}: any) => (
                    <PostFeedCard
                        post={item}
                        isModerator={isModerator}
                        isAdmin={isAdmin}
                        isOwner={currentUser.username === item.ownerUsername}
                        onModeratorRemoval={moderatorRemovePost}
                        onOwnerDelete={ownerDeletePost}
                        onHandleReaction={onHandleReaction}
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
                        <BigText style={{
                            marginLeft: 15
                        }}>
                            Your Feed
                        </BigText>
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
                style={styles.list}
            />
        </MainContainer>
    );
}

export default PostListingScreen;
