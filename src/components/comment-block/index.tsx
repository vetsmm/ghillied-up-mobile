import React, {useEffect} from "react";
import {Dimensions, StyleSheet} from "react-native";
import {getBottomSpace} from 'react-native-iphone-x-helper';

import Comment from "../comment";
import {View} from "native-base";
import {CommentDetailDto} from "../../shared/models/comments/comment-detail.dto";
import CommentActionSheet from "../bottom-sheets/comment-action-sheet";
import {ReportMenuDialog} from "../reporting/report-menu-dialog";
import {PostDetailDto} from "../../shared/models/posts/post-detail.dto";
import {FlagCategory} from "../../shared/models/flags/flag-category";
import flagService from "../../shared/services/flag.service";
import {SuccessAlert} from "../alerts/success-alert";

export interface CommentBlockProps {
  post: PostDetailDto;
  item: CommentDetailDto;
  index: number;
  onCommentReact: (commentId: string, shouldDelete: boolean) => void;
  onCommentReply: (comment: CommentDetailDto) => void;
  onDeleteComment: (commentId: string) => void;
  onModeratorRemoval: (commentId: string) => void;
  onEditComment: (comment: CommentDetailDto) => void;
  onLoadReplies: (commentId: string) => void;
  isAdmin: boolean;
  isModerator: boolean;
  isOwner: boolean;
}

const dimensions = Dimensions.get('window');

export const CommentBlock = ({
                               item,
                               post,
                               index,
                               onCommentReply,
                               onCommentReact,
                               onDeleteComment,
                               onModeratorRemoval,
                               onEditComment,
                               onLoadReplies,
                               isAdmin,
                               isModerator,
                               isOwner
                             }: CommentBlockProps) => {

  const [isOpen, setIsOpen] = React.useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = React.useState(false);
  const [showReportAlert, setShowReportAlert] = React.useState(false);
  const cancelRef = React.useRef(null);

  useEffect(() => {
    if (showReportAlert) {
      setTimeout(() => {
        setShowReportAlert(false);
      }, 3000);
    }
  }, [showReportAlert]);

  const onReportComment = (category: FlagCategory, details: string) => {
    setIsReportDialogOpen(false);
    flagService.flagComment({
      commentId: item.id,
      flagCategory: category,
      details
    })
      .then(() => {
        setShowReportAlert(true);
      })
      .catch((err) => {
        console.log("Comment report failed");
      });
  }

  // @ts-ignore
  return (
    <View
      mt={3}
      borderRadius={10}
      backgroundColor={"#266186"}
      marginLeft={5}
      marginRight={5}
    >
      <Comment
        comment={item}
        hasChildren={item?.numberOfChildComments > 0}
        index={index}
        nested={0}
        // @ts-ignore
        isLast={item.numberOfChildComments === 0}
        parentCommentLength={item.numberOfChildComments}
        totalChildren={item?.numberOfChildComments || 0}
        onCommentReact={onCommentReact}
        onCommentReply={onCommentReply}
        setOpenActionSheet={setIsOpen}
        isOp={post.postedBy.username === item.createdBy.username}
      />
      <CommentActionSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onDelete={() => {
          setIsOpen(false);
          onDeleteComment(item.id);
        }}
        onRemove={() => {
          setIsOpen(false);
          onModeratorRemoval(item.id);
        }}
        onEdit={() => {
          setIsOpen(false);
          onEditComment(item);
        }}
        onReport={() => {
          setIsOpen(false);
          setIsReportDialogOpen(true);
        }}
        isAdmin={isAdmin}
        isModerator={isModerator}
        isOwner={isOwner}
      />

      <ReportMenuDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        cancelRef={cancelRef}
        onReport={onReportComment}
        title={"Report Comment"}
      />
      {showReportAlert && (
        <SuccessAlert
          title="Report Sent"
          body="Thank you for reporting this comment. We appreciate your help in keeping our community safe. If appropriate, we will take the necessary actions."
        />
      )}
    </View>
  );
}

export default CommentBlock;


const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400'
  },
  highlight: {
    fontWeight: '700'
  },
  flatList: {
    flex: 1,
    marginBottom: getBottomSpace() + 60,
    minHeight: dimensions.height - (getBottomSpace() + 160)
  },
  flatListWrapper: {
    flex: 1,
    flexGrow: 1
  },
  arrow: {
    size: 24,
    thickness: 2,
    color: 'white'
  },
  showMoreComments: {
    marginLeft: 12,
    color: 'white'
  },
  showMoreCommentsTwo: {
    marginLeft: 12,
    marginTop: 8,
    color: 'white'
  }
});
