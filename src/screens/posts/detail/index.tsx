import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {
  FlatList,
  RefreshControl
} from 'react-native';
import {colorsVerifyCode} from "../../../components/colors";
import {Text, Spinner, View} from "native-base";
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
import {CommentDetailDto} from "../../../shared/models/comments/comment-detail.dto";
import MainContainer from "../../../components/containers/MainContainer";
import PostSharedElement from "../../../components/post-shared-element";
import FlatListEmptyComponent from "../../../components/flatlist-empty-component";
import Immutable from "immutable";
import {CommentStatus} from "../../../shared/models/comments/comment-status";
import postCommentReactionService from "../../../shared/services/post-comment-reaction.service";
import {FlagCategory} from "../../../shared/models/flags/flag-category";
import flagService from "../../../shared/services/flag.service";
import {SuccessAlert} from "../../../components/alerts/success-alert";
import AppConfig from '../../../config/app.config';

const {primary} = colorsVerifyCode;


interface Route {
  params: {
    postId: string;
  };
}

export const PostDetailScreen: React.FC<{ route: Route }> = ({route}) => {
  const [post, setPost] = React.useState<PostDetailDto | null>(null);
  const [isLoading, setLoading] = React.useState(true);
  const [isError, setError] = React.useState(false);
  const [{
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage
  }, setCursors] = React.useState<{
    startCursor: string | null;
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>({
    startCursor: null,
    endCursor: null,
    hasNextPage: false,
    hasPreviousPage: false
  });
  // const [commentTree, setCommentTree] = React.useState<CommentTree | null>(null);
  const [levelOneComments, setLevelOneComments] = React.useState<Immutable.OrderedMap<string, CommentDetailDto>>(Immutable.OrderedMap()); // key is commentId
  const [levelTwoComments, setLevelTwoComments] = React.useState<Immutable.OrderedMap<string, CommentDetailDto>>(Immutable.OrderedMap()); // Key is the parent comment id
  const [showReportAlert, setShowReportAlert] = React.useState(false);
  const [showBookmarkAlert, setShowBookmarkAlert] = React.useState(false);
  
  
  useEffect(() => {
    if (showReportAlert) {
      setTimeout(() => {
        setShowReportAlert(false);
      }, 3000);
    }
    if (showBookmarkAlert) {
      setTimeout(() => {
        setShowBookmarkAlert(false);
      }, AppConfig.timeouts.reportDialogs);
    }
  }, [showReportAlert, showBookmarkAlert]);
  
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
  
  const getTopLevelComments = (cursor?: string) => {
    commentService.getCommentsForPost(postId, cursor)
      .then(res => {
        setCursors(prevState => ({
          ...prevState,
          startCursor: res.meta.startCursor,
          endCursor: res.meta.endCursor,
          hasNextPage: res.meta.hasNextPage,
          hasPreviousPage: res.meta.hasPreviousPage
        }));
        if (cursor) {
          // set level 1 comments according to their comment.createdDate in ascending order
          setLevelOneComments(prevState =>
            prevState.merge(
              Immutable.OrderedMap(
                res.data.map(comment => [comment.id, comment])
              )
            )
          );
        } else {
          setLevelOneComments(Immutable.OrderedMap(res.data.map(comment => [comment.id, comment])));
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  const getPost = () => {
    setLoading(true);
    postService.getPost(postId).then((res) => {
      setPost(res.data);
      setError(false);
    }).catch((err) => {
      setError(true);
    });
    setLoading(false);
  }
  
  React.useEffect(() => {
    // Return the function to unsubscribe from the event, so it gets removed on unmount
    return navigation.addListener('focus', () => {
      setLoading(true);
      setError(false);
      setLevelOneComments(Immutable.OrderedMap());
      setLevelTwoComments(Immutable.OrderedMap());
      setPost(null);
  
      // The screen is focused
      postService.getPost(postId).then((res) => {
        setPost(res.data);
        setError(false);
      }).catch((err) => {
        setError(true);
      }).finally(() => {
        setLoading(false);
      });
    });
  }, [getPost, navigation, postId]);
  
  useEffect(() => {
    if (post) {
      if (post.numberOfComments > 0) {
        getTopLevelComments();
      } else {
        setLevelOneComments(Immutable.OrderedMap());
      }
    }
  }, [post]);
  
  const moderatorRemovePost = (post) => {
    PostService.updatePost(post.id, {
      status: PostStatus.REMOVED
    })
      .then(async res => {
        moveTo("FeedStack", {screen: "PostFeed"});
      })
      .catch(err => {
        // todo: handle
        console.log(err);
      });
  };
  
  const onBookmarkPost = (post) => {
    postService.bookmarkPost(post.id)
      .then(() => {
        setShowBookmarkAlert(true);
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  const reportPost = (category: FlagCategory, details: string) => {
    flagService.flagPost({
      postId: postId,
      flagCategory: category,
      details
    })
      .then(() => {
        setShowReportAlert(true);
      })
      .catch((err) => {
        console.log("Report report failed");
      });
  };
  
  const ownerDeletePost = (post) => {
    PostService.updatePost(post.id, {
      status: PostStatus.ARCHIVED
    })
      .then(async res => {
        moveTo("FeedStack", {screen: "PostFeed"});
      })
      .catch(err => {
        // todo: handle
        console.log(err);
      });
  };
  
  const onHandleReaction = (postId: string, reaction: ReactionType | null) => {
    postReactionService.reactToPost(reaction, postId)
      .then(async () => {
        await getPost();
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  const onHandleCommentReaction = (commentId: string, shouldDelete: boolean) => {
    postCommentReactionService.reactToComment(shouldDelete ? null : ReactionType.THUMBS_UP, commentId)
      .then(async () => {
        await getPost();
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  const onHandleCommentReply = (comment: CommentDetailDto) => {
    // TODO: IMPLEMENT reply to comments
    //  by navigating to new screen within current stack
    // Can be implemented if we decide to go threaded comments route
    console.log("Comment Reply");
  }
  
  const moderatorRemoveComment = (commentId: string) => {
    commentService.deleteComment(commentId)
      .then(async res =>
        getPost()
      );
  };
  
  const ownerDeleteComment = (commentId: string) => {
    commentService.updateComment(commentId, {
      status: CommentStatus.ARCHIVED
    })
      .then(async res => {
        await getPost();
      });
  }
  
  const onHandleCommentEdit = (comment: CommentDetailDto) => {
    moveTo("UpdatePostComment", {post, comment});
  }
  
  const loadNextPage = async () => {
    if (hasNextPage) {
      console.log("Loading more comments", endCursor);
      getTopLevelComments(endCursor!);
    }
  }
  
  const loadReplies = (commentId: string) => {
    const comment = levelOneComments.get(commentId);
    if (comment) {
      commentService.getChildComments({
        commentIds: comment.childCommentIds,
        height: comment.commentHeight + 1
      })
        .then(res => {
          if (res.data.length > 0) {
            setLevelTwoComments(prevState => prevState.merge(Immutable.OrderedMap(res.data.map(comment => [comment.id, comment]))));
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  
  const renderItem = useCallback(
    ({item, index}: { item: CommentDetailDto; index: number }) => {
      return (
        <CommentBlock
          key={item.id}
          item={item}
          index={index}
          onCommentReact={onHandleCommentReaction}
          onCommentReply={onHandleCommentReply}
          onDeleteComment={ownerDeleteComment}
          onEditComment={onHandleCommentEdit}
          onModeratorRemoval={moderatorRemoveComment}
          isAdmin={isAdmin}
          isModerator={isModerator}
          isOwner={isPostOwner}
          onLoadReplies={loadReplies}
          post={post!}
        />
      );
    }, [isAdmin, isModerator, isPostOwner]);
  
  const keyExtractor = (item, index) => item.id;
  
  const renderSpinner = () => {
    return <Spinner color="emerald.500" size="lg"/>;
  };
  
  return (
    <MainContainer style={[styles.container]}>
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
            data={levelOneComments.isEmpty() ? [] : levelOneComments.valueSeq().toArray()}
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
                />
                {showReportAlert && (
                  <SuccessAlert
                    title="Report Sent"
                    body="Thank you for reporting this post. We appreciate your help in keeping our community safe. If appropriate, we will take the necessary actions."
                  />
                )}
                {showBookmarkAlert && (
                  <SuccessAlert
                    title="Bookmark Added"
                    body="This post has been added to your bookmarks."
                  />
                )}
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
