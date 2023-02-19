import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {
    FlatList,
    RefreshControl, TouchableOpacity
} from 'react-native';
import {colorsVerifyCode} from "../../../components/colors";
import {Text, Spinner, View, Hidden, VStack, HStack} from "native-base";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import PostService from "../../../shared/services/post.service";
import {PostStatus} from "../../../shared/models/posts/post-status";
import {ReactionType} from "../../../shared/models/reactions/reaction-type";
import postReactionService from "../../../shared/services/post-reaction.service";
import postService from "../../../shared/services/post.service";
import {PostDetailDto} from "../../../shared/models/posts/post-detail.dto";
import styles from "../../ghillies/detail/styles";
import {GhillieRole} from "../../../shared/models/ghillies/ghillie-role";
import commentService from "../../../shared/services/comment.service";
import CommentBlock from "../../../components/comment-block";
import {Colors} from "../../../shared/styles";
import MainContainer from "../../../components/containers/MainContainer";
import PostSharedElement from "../../../components/post-shared-element";
import FlatListEmptyComponent from "../../../components/flatlist-empty-component";
import postCommentReactionService from "../../../shared/services/post-comment-reaction.service";
import {FlagCategory} from "../../../shared/models/flags/flag-category";
import flagService from "../../../shared/services/flag.service";
import {ParentCommentDto} from '../../../shared/models/comments/parent-comment.dto';
import {ChildCommentDto} from '../../../shared/models/comments/child-comment.dto';
import {FlashMessageRef} from "../../../components/flash-message/index";
import GhillieIcon from "../../../components/ghillie-icon";

const {primary} = colorsVerifyCode;


interface Route {
    params: {
        postId: string;
    };
}

function MobileHeader() {
    const navigation: any = useNavigation();

    const goBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <Hidden from="md">
            <VStack px="4" mt="4" mb="5" space="9">
                <HStack space="2" alignItems="center">
                    <TouchableOpacity style={{
                        // position: 'absolute',
                        // left: 30,
                        zIndex: 9,
                    }} onPress={goBack}>
                        <GhillieIcon name="back" size={40} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                </HStack>
            </VStack>
        </Hidden>
    );
}

export const PostDetailScreen: React.FC<{ route: Route }> = ({route}) => {
    const [post, setPost] = React.useState<PostDetailDto>();
    const [isLoading, setLoading] = React.useState(true);
    const [isError, setError] = React.useState(false);
    const [parentCommentsPage, setParentCommentsPage] = React.useState(1);
    const [parentComments, setParentComments] = React.useState<ParentCommentDto[]>([]);
    const [postReactionLoading, setPostReactionLoading] = React.useState(false);
    const [parentCommentReactionLoading, setParentCommentReactionLoading] = React.useState(false);
    const [childCommentReactionLoading, setChildCommentReactionLoading] = React.useState(false);

    const isAdmin = useSelector(
        (state: IRootState) => state.authentication.isAdmin
    );

    const account = useSelector(
        (state: IRootState) => state.authentication.account
    );

    const isModerator = useSelector(
        (state: IRootState) =>
            state.ghillie.ghillie.memberMeta !== null &&
            (
                state.ghillie.ghillie.memberMeta?.role === GhillieRole.OWNER ||
                state.ghillie.ghillie.memberMeta?.role === GhillieRole.MODERATOR
            )
    );

    const isPostOwner = post ? post?.postedBy?.username === account.username : false;

    // eslint-disable-next-line no-unsafe-optional-chaining
    const {postId} = route?.params;

    const navigation: any = useNavigation();

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    const getTopLevelComments = (page: number) => {
        commentService.getParentCommentsForPost(postId, parentCommentsPage)
            .then(commentResponse => {
                if (parentCommentsPage > 1) {
                    if (page === parentCommentsPage) {
                        return;
                    }

                    if (commentResponse.length > 0) {
                        setParentComments([...parentComments, ...commentResponse]);
                        setParentCommentsPage(page);
                        return;
                    }
                    setParentCommentsPage(page - 1);
                } else {
                    setParentComments(commentResponse);
                    setParentCommentsPage(page);
                }
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: page === 1 ? 'Failed to load comments' : 'Failed to load more comments',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                if (page > 1) {
                    setParentCommentsPage(page - 1);
                }
            })
    }

    const getPost = () => {
        setLoading(true);
        postService.getPost(postId).then((res) => {
            setPost(res.data);
            setError(false);
        }).catch(() => {
            FlashMessageRef.current?.showMessage({
                message: 'An error occurred while loading post',
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
            setError(true);
        });
        setLoading(false);
    }

    React.useEffect(() => {
        // Return the function to unsubscribe from the event, so it gets removed on unmount
        return navigation.addListener('focus', () => {
            setLoading(true);
            setError(false);
            setParentComments([]);
            // setLevelOneComments(Immutable.OrderedMap());
            // setLevelTwoComments(Immutable.OrderedMap());
            setPost(undefined);

            // The screen is focused
            postService.getPost(postId).then((res) => {
                setPost(res.data);
                setError(false);
            }).catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while loading post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                setError(true);
            }).finally(() => {
                setLoading(false);
            });
        });
    }, [getPost, navigation, postId]);

    useEffect(() => {
        if (post) {
            if (post.numberOfComments > 0) {
                getTopLevelComments(parentCommentsPage);
            } else {
                setParentComments([]);
            }
        }
    }, [post]);

    const moderatorRemovePost = (post) => {
        PostService.updatePost(post.id, {
            status: PostStatus.REMOVED
        })
            .then(async () => {
                FlashMessageRef.current?.showMessage({
                    message: 'Post Removed',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                moveTo("Feed", {screen: "PostFeed"});
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while removing post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    };

    const onBookmarkPost = (post) => {
        postService.bookmarkPost(post.id)
            .then(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'Post bookmarked',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while bookmarking post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    const reportPost = (category: FlagCategory, details: string) => {
        flagService.flagPost({
            postId: postId,
            flagCategory: category,
            details
        })
            .then(() => {
                FlashMessageRef.current?.showMessage({
                    title: 'Post Reported',
                    message: 'Thank you for reporting this post',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while reporting post',
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
            .then(async () => {
                FlashMessageRef.current?.showMessage({
                    message: 'Post removed',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                moveTo("Feed", {screen: "PostFeed"});
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while deleting post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    };

    const onHandleReaction = (postId: string, reaction: ReactionType | null) => {
        setPostReactionLoading(true);
        postReactionService.reactToPost(reaction, postId)
            .then(async () => {
                await getPost();
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while reacting to post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            }).finally(() => {
            setPostReactionLoading(false);
        });
    }

    const onHandleCommentReaction = (commentId: string, shouldDelete: boolean) => {
        setParentCommentReactionLoading(true)
        postCommentReactionService.reactToParentComment(shouldDelete ? null : ReactionType.THUMBS_UP, commentId)
            .then(async () => {
                await getTopLevelComments(parentCommentsPage - 1);
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while reacting to comment',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .finally(() => {
                setParentCommentReactionLoading(false);
            });
    }

    const onHandleChildCommentReaction = (commentId: string, shouldDelete: boolean) => {
        setChildCommentReactionLoading(true);
        postCommentReactionService.reactToChildComment(shouldDelete ? null : ReactionType.THUMBS_UP, commentId)
            .then(async () => {
                await getTopLevelComments(parentCommentsPage - 1);
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while reacting to comment',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .finally(() => {
                setChildCommentReactionLoading(false);
            });
    }

    const onHandleCommentReply = (comment: ParentCommentDto) => {
        moveTo("CreateChildComment", {parentComment: comment});
    }

    const moderatorRemoveComment = (commentId: string, isParent: boolean) => {
        if (isParent) {
            commentService.deleteParentComment(commentId)
                .then(() => {
                    FlashMessageRef.current?.showMessage({
                        message: 'Comment removed',
                        type: 'success',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                    getPost()
                })
                .catch(() => {
                    FlashMessageRef.current?.showMessage({
                        message: 'An error occurred while removing comment',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                });
        } else {
            commentService.deleteReplyComment(commentId)
                .then(() => {
                    FlashMessageRef.current?.showMessage({
                        message: 'Comment removed',
                        type: 'success',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                    getPost()
                })
                .catch(() => {
                    FlashMessageRef.current?.showMessage({
                        message: 'An error occurred while removing comment',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                });
        }
    };

    const ownerDeleteComment = (commentId: string, isParent: boolean) => {
        if (isParent) {
            commentService.deleteParentComment(commentId)
                .then(() => {
                    FlashMessageRef.current?.showMessage({
                        message: 'Comment deleted',
                        type: 'success',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                    getPost()
                })
                .catch(() => {
                    FlashMessageRef.current?.showMessage({
                        message: 'An error occurred while deleting comment',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                })
        } else {
            commentService.deleteReplyComment(commentId)
                .then(() => {
                    FlashMessageRef.current?.showMessage({
                        message: 'Comment Reply Deleted',
                        type: 'success',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                    getPost()
                })
                .catch(() => {
                    FlashMessageRef.current?.showMessage({
                        message: 'An error occurred while deleting comment reply',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                });
        }
    }

    const onHandleCommentEdit = (comment: ParentCommentDto) => {
        moveTo("UpdatePostComment", {post, comment});
    }

    const onHandleChildCommentEdit = (comment: ChildCommentDto) => {
        moveTo("UpdateChildComment", {comment});
    }

    const loadNextPage = async () => {
        getTopLevelComments(parentCommentsPage);
    }

    const onHandleViewReplies = (commentId: string) => {
        moveTo("CommentThread", {parentCommentId: commentId});
    }

    const onSubscribe = (postId: string) => {
        PostService.subscribeToPost(postId)
            .then(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'Subscribed to post',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                setPost((prevState) => {
                    return {
                        ...prevState!,
                        isSubscribed: true
                    }
                });
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while subscribing to the post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    const onUnsubscribe = (postId: string) => {
        PostService.unsubscribeFromPost(postId)
            .then(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'Unsubscribed to post',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                setPost((prevState) => {
                    return {
                        ...prevState!,
                        isSubscribed: false
                    }
                });
            })
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while Unsubscribing to the post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    const renderItem = useCallback(
        ({item, index}: { item: ParentCommentDto; index: number }) => {
            return (
                <CommentBlock
                    key={item.id}
                    item={item}
                    index={index}
                    onCommentReact={onHandleCommentReaction}
                    onReactToChildComment={onHandleChildCommentReaction}
                    onCommentReply={onHandleCommentReply}
                    onDeleteComment={ownerDeleteComment}
                    onEditComment={onHandleCommentEdit}
                    onEditChildComment={onHandleChildCommentEdit}
                    onModeratorRemoval={moderatorRemoveComment}
                    isAdmin={isAdmin}
                    isModerator={isModerator}
                    isOwner={isPostOwner}
                    post={post!}
                    onViewReplies={onHandleViewReplies}
                    parentCommentLoading={parentCommentReactionLoading}
                    childCommentLoading={childCommentReactionLoading}
                />
            );
        }, [isAdmin, isModerator, isPostOwner]);

    const keyExtractor = (item) => item.id;

    const renderSpinner = () => {
        return <Spinner color="emerald.500" size="lg"/>;
    };

    return (
        <MainContainer style={[styles.container]}>
            <MobileHeader/>

            {isError && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Post is unavailable</Text>
                </View>
            )}
            {isLoading
                ? (
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Spinner size="lg" color="emerald.500"/>
                        <Text style={{
                            marginTop: 10,
                            color: colorsVerifyCode.white,
                            fontSize: 16
                        }}>Loading Post</Text>
                    </View>
                )
                : (
                    <FlatList
                        refreshing={isLoading}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={getPost}
                                enabled={true}
                                progressBackgroundColor={Colors.secondary}
                                tintColor={Colors.secondary}
                            />
                        }
                        ListFooterComponent={isLoading ? renderSpinner : null}
                        showsVerticalScrollIndicator={false}
                        style={[styles.list, {backgroundColor: primary}]}
                        contentContainerStyle={styles.contentContainer}
                        renderItem={renderItem}
                        data={parentComments}
                        keyExtractor={keyExtractor}
                        pagingEnabled={true}
                        maxToRenderPerBatch={20}
                        onEndReachedThreshold={2}
                        onEndReached={loadNextPage}
                        snapToInterval={300}
                        ListEmptyComponent={
                            post && (
                                <FlatListEmptyComponent text={"Be the first to comment!"}/>
                            )
                        }
                        ListHeaderComponent={post && (
                            <>
                                <PostSharedElement
                                    postId={postId}
                                    post={post}
                                    onBookmarkPost={onBookmarkPost}
                                    reportPost={reportPost}
                                    ownerDeletePost={ownerDeletePost}
                                    moderatorRemovePost={moderatorRemovePost}
                                    onHandleReaction={onHandleReaction}
                                    isPostOwner={isPostOwner}
                                    isAdmin={isAdmin}
                                    isModerator={isModerator}
                                    navigation={navigation}
                                    reactionLoading={postReactionLoading}
                                    onSubscribe={onSubscribe}
                                    onUnsubscribe={onUnsubscribe}
                                />
                            </>
                        )}
                    >
                    </FlatList>
                )}
        </MainContainer>
    );
};

(PostDetailScreen as any).sharedElements = (route: any) => {
    const {postId} = route.params;
    return [`post#${postId}-Image`];
};

export default PostDetailScreen;
