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
import MainContainer from "../../../components/containers/MainContainer";
import PostSharedElement from "../../../components/post-shared-element";
import FlatListEmptyComponent from "../../../components/flatlist-empty-component";
import postCommentReactionService from "../../../shared/services/post-comment-reaction.service";
import {FlagCategory} from "../../../shared/models/flags/flag-category";
import flagService from "../../../shared/services/flag.service";
import {SuccessAlert} from "../../../components/alerts/success-alert";
import AppConfig from '../../../config/app.config';
import {ParentCommentDto} from '../../../shared/models/comments/parent-comment.dto';
import {ChildCommentDto} from '../../../shared/models/comments/child-comment.dto';

const {primary} = colorsVerifyCode;


interface Route {
  params: {
    postId: string;
  };
}

export const PostDetailScreen: React.FC<{ route: Route }> = ({route}) => {
  const [post, setPost] = React.useState<PostDetailDto>();
  const [isLoading, setLoading] = React.useState(true);
  const [isError, setError] = React.useState(false);
  const [parentCommentsPage, setParentCommentsPage] = React.useState(1);
  const [parentComments, setParentComments] = React.useState<ParentCommentDto[]>([]);
  // const [levelOneComments, setLevelOneComments] = React.useState<Immutable.OrderedMap<string, CommentDetailDto>>(Immutable.OrderedMap()); // key is commentId
  // const [levelTwoComments, setLevelTwoComments] = React.useState<Immutable.OrderedMap<string, CommentDetailDto>>(Immutable.OrderedMap()); // Key is the parent comment id
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
      .catch(err => {
        console.log(err);
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
      setParentComments([]);
      // setLevelOneComments(Immutable.OrderedMap());
      // setLevelTwoComments(Immutable.OrderedMap());
      setPost(undefined);
  
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
      .then(async res => {
        moveTo("Feed", {screen: "PostFeed"});
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
        moveTo("Feed", {screen: "PostFeed"});
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
    postCommentReactionService.reactToParentComment(shouldDelete ? null : ReactionType.THUMBS_UP, commentId)
      .then(async () => {
        await getTopLevelComments(parentCommentsPage - 1);
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  const onHandleChildCommentReaction = (commentId: string, shouldDelete: boolean) => {
    postCommentReactionService.reactToChildComment(shouldDelete ? null : ReactionType.THUMBS_UP, commentId)
      .then(async () => {
        await getTopLevelComments(parentCommentsPage - 1);
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  const onHandleCommentReply = (comment: ParentCommentDto) => {
    moveTo("CreateChildComment", {parentComment: comment});
  }
  
  const moderatorRemoveComment = (commentId: string) => {
    commentService.deleteParentComment(commentId)
      .then(() =>
        getPost()
      );
  };
  
  const ownerDeleteComment = (commentId: string) => {
    commentService.deleteParentComment(commentId)
      .then(() => {
        getPost();
      });
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
