import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Center, Hidden, VStack, HStack} from 'native-base';
import MainContainer from '../../../components/containers/MainContainer';
import ParentComment from '../../../components/parent-comment';
import {ParentCommentDto} from '../../../shared/models/comments/parent-comment.dto';
import {ChildCommentDto} from '../../../shared/models/comments/child-comment.dto';
import commentService from '../../../shared/services/comment.service';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {IRootState} from '../../../store';
import postCommentReactionService from '../../../shared/services/post-comment-reaction.service';
import {ReactionType} from '../../../shared/models/reactions/reaction-type';
import CommentActionSheet from '../../../components/bottom-sheets/comment-action-sheet';
import {ReportMenuDialog} from '../../../components/reporting/report-menu-dialog';
import {FlagCategory} from '../../../shared/models/flags/flag-category';
import flagService from '../../../shared/services/flag.service';
import {GhillieRole} from '../../../shared/models/ghillies/ghillie-role';
import postService from '../../../shared/services/post.service';
import {colorsVerifyCode} from '../../../components/colors';
import {FlashList} from '@shopify/flash-list';
import {RefreshControl, TouchableOpacity} from 'react-native';
import {Colors} from '../../../shared/styles';
import ChildComment from '../../../components/child-comment';
import {PostDetailDto} from '../../../shared/models/posts/post-detail.dto';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';
import {SuccessAlert} from '../../../components/alerts/success-alert';
import AppConfig from '../../../config/app.config';
import {Ionicons} from "@expo/vector-icons";
import {FlashMessageRef} from "../../../app/App";

interface Route {
  params: {
    parentCommentId: string;
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
              <Ionicons name="arrow-back-circle-outline" size={40} color={colorsVerifyCode.secondary}/>
            </TouchableOpacity>
            <Center>
              <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  _light={{color: 'white'}}
                  _dark={{color: 'white'}}
              >
                Comment Replies
              </Text>
            </Center>
          </HStack>
        </VStack>
      </Hidden>
  );
}

const ChildCommentBlock = ({
                             item,
                             post,
                             onHandleChildCommentReaction,
                             isAdmin,
                             isPostOwner,
                             isModerator,
                             onHandleChildCommentEdit,
                             moderatorRemoveComment,
                             ownerDeleteComment,
                             onReportComment
                           }) => {
  const [isChildOpen, setIsChildOpen] = React.useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = React.useState(false);
  const [showReportAlert, setShowReportAlert] = React.useState(false);
  
  const cancelRef = React.useRef(null);
  
  useEffect(() => {
    if (showReportAlert) {
      setTimeout(() => {
        setShowReportAlert(false);
      }, AppConfig.timeouts.reportDialogs);
    }
  }, [showReportAlert]);

  return (
    <View style={{
      flexDirection: "column",
      flex: 1,
      marginLeft: "7%",
      marginRight: "7%",
      marginTop: 5,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: "#266186"
    }}>
      <ChildComment
        comment={item}
        index={item.id}
        isOp={post?.postedBy?.username === item.createdBy.username}
        onCommentReact={onHandleChildCommentReaction}
        setOpenActionSheet={(isOpen: boolean) => setIsChildOpen(isOpen)}
      />
      <CommentActionSheet
        isOpen={isChildOpen}
        onClose={() => setIsChildOpen(false)}
        onDelete={() => {
          setIsChildOpen(false);
          ownerDeleteComment(item.id, false);
        }}
        onRemove={() => {
          setIsChildOpen(false);
          moderatorRemoveComment(item.id, false);
        }}
        onEdit={() => {
          setIsChildOpen(false);
          onHandleChildCommentEdit(item);
        }}
        onReport={() => {
          setIsChildOpen(false);
          setIsReportDialogOpen(true);
        }}
        isAdmin={isAdmin}
        isModerator={isModerator}
        isOwner={isPostOwner}
      />
      <ReportMenuDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        cancelRef={cancelRef}
        onReport={(category, details) => onReportComment(item.id, category, details)}
        title={"Report Comment"}
      />
      {showReportAlert && (
        <SuccessAlert
          title="Report Sent"
          body="Thank you for reporting this comment. We appreciate your help in keeping our community safe. If appropriate, we will take the necessary actions."
        />
      )}
    </View>
  )
}

export const CommentThreadScreen: React.FC<{ route: Route }> = ({route}) => {
  const {params} = {...route};
  const {parentCommentId} = {...params};
  
  const navigation: any = useNavigation();
  
  const [post, setPost] = useState<PostDetailDto>();
  const [parentComment, setParentComment] = useState<ParentCommentDto>();
  const [commentReplies, setCommentReplies] = useState<ChildCommentDto[]>();
  const [isParentOpen, setIsParentOpen] = React.useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = React.useState(false);
  const [showReportAlert, setShowReportAlert] = React.useState(false);
  const [commentRepliesPage, setCommentRepliesPage] = React.useState(1);
  const [parentCommentError, setParentCommentError] = React.useState(false);
  const [commentRepliesError, setCommentRepliesError] = React.useState(false);
  const [commentRepliesLoading, setCommentRepliesLoading] = React.useState(false);
  const cancelRef = React.useRef(null);
  
  useEffect(() => {
    if (showReportAlert) {
      setTimeout(() => {
        setShowReportAlert(false);
      }, AppConfig.timeouts.reportDialogs);
    }
  }, [showReportAlert]);
  
  React.useEffect(() => {
    const initialLoad = navigation.addListener('focus', async () => {
      getComment();
      getCommentReplies(1);
    });
    
    return initialLoad;
  }, [parentCommentId]);
  
  React.useEffect(() => {
    if (parentComment) {
      postService.getPost(parentComment.postId).then((post) => {
        setPost(post.data);
      });
    }
  }, [parentComment]);
  
  const moveTo = (screen, payload?) => {
    navigation.navigate(screen, {...payload});
  };
  
  const getComment = () => {
    commentService.getParentById(parentCommentId).then((parentComment) => {
      setParentComment(parentComment);
      setParentCommentError(false);
    }).catch((error) => {
      setParentCommentError(true);
    });
  }
  
  const getCommentReplies = (page: number) => {
    setCommentRepliesLoading(true);
    commentService.getReplyComments(parentCommentId, page).then((replies) => {
      setCommentReplies(replies);
      setCommentRepliesError(false);
    }).catch((error) => {
      FlashMessageRef.current?.showMessage({
        message: "An error occurred while loading replies",
        type: 'danger',
        style: {
          justifyContent: 'center',
          alignItems: 'center',
        }
      });
      setCommentRepliesError(true);
    });
    setCommentRepliesLoading(false);
  }
  
  const isAdmin = useSelector(
    (state: IRootState) => state.authentication.isAdmin
  );

  const isModerator = useSelector(
    (state: IRootState) =>
      state.ghillie.ghillie.memberMeta !== null &&
      (
        state.ghillie.ghillie.memberMeta?.role === GhillieRole.OWNER ||
        state.ghillie.ghillie.memberMeta?.role === GhillieRole.MODERATOR
      )
  );
  
  const isPostOwner = post ? (post?.postedBy?.username === parentComment?.createdBy.username) : false;
  
  const onHandleCommentReaction = (commentId: string, shouldDelete: boolean) => {
    postCommentReactionService.reactToParentComment(shouldDelete ? null : ReactionType.THUMBS_UP, commentId)
      .then(async () => {
        await getComment();
      })
      .catch(err => {
        FlashMessageRef.current?.showMessage({
          message: 'An error occurred while reacting to this comment.',
          type: 'danger',
          style: {
            justifyContent: 'center',
            alignItems: 'center',
          }
        });
      });
  }
  
  const onHandleCommentReply = (comment: ParentCommentDto) => {
    moveTo("CreateChildComment", {parentComment: comment});
  }
  
  const ownerDeleteComment = (commentId: string, isParent = true) => {
    if (isParent) {
      commentService.deleteParentComment(commentId)
        .then(async () => {
          navigation.goBack();
        });
    } else {
      commentService.deleteReplyComment(commentId)
        .then(async () => {
          FlashMessageRef.current?.showMessage({
            message: 'An error occurred while deleting this comment',
            type: 'danger',
            style: {
              justifyContent: 'center',
              alignItems: 'center',
            }
          });
          getCommentReplies(1);
        })
        .catch(err => {
          FlashMessageRef.current?.showMessage({
            message: 'An error occurred while deleting this comment.',
            type: 'danger',
            style: {
              justifyContent: 'center',
              alignItems: 'center',
            }
          });
        })
    }
  }
  
  const moderatorRemoveComment = (commentId: string, isParent = true) => {
    if (isParent) {
      commentService.deleteParentComment(commentId)
        .then(() => {
          navigation.goBack();
        });
    } else {
      commentService.deleteReplyComment(commentId)
        .then(() => {
          getCommentReplies(1);
        });
    }
  };
  
  const onHandleCommentEdit = async (comment: ParentCommentDto) => {
    const post = await postService.getPost(comment.postId);
    moveTo("UpdatePostComment", {post: post.data, comment});
  }
  
  const onHandleChildCommentEdit = (comment: ChildCommentDto) => {
    moveTo("UpdateChildComment", {comment});
  }
  
  const onReportComment = (commentId: string, category: FlagCategory, details: string) => {
    setIsReportDialogOpen(false);
    flagService.flagComment({
      commentId: commentId,
      flagCategory: category,
      details
    })
      .then(() => {
        setShowReportAlert(true);
      })
      .catch((err) => {
        FlashMessageRef.current?.showMessage({
          message: 'An error occurred while reporting this comment.',
          type: 'danger',
          style: {
            justifyContent: 'center',
            alignItems: 'center',
          }
        });
      });
  }
  
  const onHandleChildCommentReaction = (commentId: string, shouldDelete: boolean) => {
    postCommentReactionService.reactToChildComment(shouldDelete ? null : ReactionType.THUMBS_UP, commentId)
      .then(async () => {
        await getCommentReplies(commentRepliesPage - 1);
      })
      .catch(err => {
        FlashMessageRef.current?.showMessage({
          message: 'An error occurred while reacting to this comment.',
          type: 'danger',
          style: {
            justifyContent: 'center',
            alignItems: 'center',
          }
        });
      });
  }
  
  const loadNextPage = () => {
    getCommentReplies(commentRepliesPage)
  }
  
  const handleRefresh = () => {
    getComment();
    getCommentReplies(1)
  };
  
  const _renderHeader = () => (
    <>
      {parentComment && (
        <View
          mt={3}
          borderRadius={10}
          backgroundColor={"#266186"}
          marginLeft={2}
          marginRight={2}
          borderBottomWidth={5}
          borderBottomColor={colorsVerifyCode.secondary}
        >
          <ParentComment
            comment={parentComment}
            hasChildren={false}
            index={0}
            isOp={isPostOwner}
            onCommentReact={onHandleCommentReaction}
            onCommentReply={onHandleCommentReply}
            setOpenActionSheet={setIsParentOpen}
          />
          <CommentActionSheet
            isOpen={isParentOpen}
            onClose={() => setIsParentOpen(false)}
            onDelete={() => {
              setIsParentOpen(false);
              ownerDeleteComment(parentComment.id);
            }}
            onRemove={() => {
              setIsParentOpen(false);
              moderatorRemoveComment(parentComment.id);
            }}
            onEdit={() => {
              setIsParentOpen(false);
              onHandleCommentEdit(parentComment);
            }}
            onReport={() => {
              setIsParentOpen(false);
              setIsReportDialogOpen(true);
            }}
            isAdmin={isAdmin}
            isModerator={isModerator}
            isOwner={isPostOwner}
          />
          <ReportMenuDialog
            isOpen={isReportDialogOpen}
            onClose={() => setIsReportDialogOpen(false)}
            cancelRef={cancelRef}
            onReport={(category, details) => onReportComment(parentComment.id, category, details)}
            title={"Report Comment"}
          />
          {showReportAlert && (
            <SuccessAlert
              title="Report Sent"
              body="Thank you for reporting this comment. We appreciate your help in keeping our community safe. If appropriate, we will take the necessary actions."
            />
          )}
        </View>
      )}
      {parentCommentError && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: colorsVerifyCode.secondary}}>Failed to load comment</Text>
        </View>
      )}
    </>
  )
  
  return (
    <MainContainer style={{
      flex: 1,
      flexGrow: 1,
      paddingTop: isIphoneX() ? getStatusBarHeight() + 20 : 30
    }}>
      <MobileHeader />
      <View style={{
        flex: 1,
        flexGrow: 1,
        paddingVertical: 8,
        marginBottom: 50
      }}>
        <FlashList
          keyExtractor={(item) => item.id}
          data={commentReplies}
          onEndReachedThreshold={0.8}
          onEndReached={loadNextPage}
          estimatedItemSize={300}
          renderItem={({item}: any) => (
            <ChildCommentBlock
              item={item}
              post={post}
              onHandleChildCommentReaction={onHandleChildCommentReaction}
              isAdmin={isAdmin}
              isPostOwner={isPostOwner}
              isModerator={isModerator}
              onHandleChildCommentEdit={onHandleChildCommentEdit}
              moderatorRemoveComment={moderatorRemoveComment}
              ownerDeleteComment={ownerDeleteComment}
              onReportComment={onReportComment}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={commentRepliesLoading}
              onRefresh={handleRefresh}
              progressBackgroundColor={Colors.secondary}
              tintColor={Colors.secondary}
            />
          }
          ListHeaderComponent={_renderHeader()}
          ListEmptyComponent={
            <Center>
              <Text style={{
                color: Colors.secondary
              }}>
                No Replies Found
              </Text>
            </Center>
          }
        />
      </View>
    </MainContainer>
  )
}

export default CommentThreadScreen;
