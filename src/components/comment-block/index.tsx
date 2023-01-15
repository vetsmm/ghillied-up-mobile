import React, {useEffect} from "react";
import {Dimensions, StyleSheet, TouchableOpacity} from "react-native";
import {getBottomSpace} from 'react-native-iphone-x-helper';

import ParentComment from "../parent-comment";
import {View, Text} from "native-base";
import CommentActionSheet from "../bottom-sheets/comment-action-sheet";
import {ReportMenuDialog} from "../reporting/report-menu-dialog";
import {PostDetailDto} from "../../shared/models/posts/post-detail.dto";
import {FlagCategory} from "../../shared/models/flags/flag-category";
import flagService from "../../shared/services/flag.service";
import {SuccessAlert} from "../alerts/success-alert";
import AppConfig from '../../config/app.config';
import {ParentCommentDto} from '../../shared/models/comments/parent-comment.dto';
import {colorsVerifyCode} from '../colors';
import ChildComment from '../child-comment';
import {ChildCommentDto} from '../../shared/models/comments/child-comment.dto';
import {FlashMessageRef} from "../flash-message/index";

export interface CommentBlockProps {
    post: PostDetailDto;
    item: ParentCommentDto;
    index: number;
    onCommentReact: (commentId: string, shouldDelete: boolean) => void;
    onCommentReply: (comment: ParentCommentDto) => void;
    onReactToChildComment: (commentId: string, shouldDelete: boolean) => void;
    onDeleteComment: (commentId: string, isParent: boolean) => void;
    onModeratorRemoval: (commentId: string, isParent: boolean) => void;
    onEditComment: (comment: ParentCommentDto) => void;
    onEditChildComment: (comment: ChildCommentDto) => void;
    isAdmin: boolean;
    isModerator: boolean;
    isOwner: boolean;
    onViewReplies: (commentId: string) => void;
    parentCommentLoading?: boolean;
    childCommentLoading?: boolean;
}

const dimensions = Dimensions.get('window');

export const CommentBlock: ({
                                item,
                                post,
                                index,
                                onCommentReply,
                                onCommentReact,
                                onDeleteComment,
                                onModeratorRemoval,
                                onEditComment,
                                onEditChildComment,
                                isAdmin,
                                isModerator,
                                isOwner,
                                onViewReplies,
                                parentCommentLoading = false,
                                childCommentLoading = false
                            }: CommentBlockProps) => JSX.Element = ({
                                                                        item,
                                                                        post,
                                                                        index,
                                                                        onCommentReply,
                                                                        onCommentReact,
                                                                        onDeleteComment,
                                                                        onModeratorRemoval,
                                                                        onEditComment,
                                                                        onEditChildComment,
                                                                        onReactToChildComment,
                                                                        isAdmin,
                                                                        isModerator,
                                                                        isOwner,
                                                                        onViewReplies,
                                                                        parentCommentLoading,
                                                                        childCommentLoading
                                                                    }: CommentBlockProps) => {

    const [isParentOpen, setIsParentOpen] = React.useState(false);
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
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while reporting the comment',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    // @ts-ignore
    return (
        <View>
            <View
                mt={3}
                borderRadius={10}
                backgroundColor={"#266186"}
                marginLeft={2}
                marginRight={2}
            >
                <ParentComment
                    comment={item}
                    hasChildren={item.commentReplyCount > 0}
                    index={index}
                    // @ts-ignore
                    parentCommentLength={item.commentReplyCount}
                    totalChildren={item.commentReplyCount || 0}
                    onCommentReact={onCommentReact}
                    onCommentReply={onCommentReply}
                    setOpenActionSheet={setIsParentOpen}
                    isOp={post?.postedBy?.username === item.createdBy.username}
                    reactionLoading={parentCommentLoading}
                />
                <CommentActionSheet
                    isOpen={isParentOpen}
                    onClose={() => setIsParentOpen(false)}
                    onDelete={() => {
                        setIsParentOpen(false);
                        onDeleteComment(item.id, true);
                    }}
                    onRemove={() => {
                        setIsParentOpen(false);
                        onModeratorRemoval(item.id, true);
                    }}
                    onEdit={() => {
                        setIsParentOpen(false);
                        onEditComment(item);
                    }}
                    onReport={() => {
                        setIsParentOpen(false);
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

            {item.commentReplyCount > 1 && (
                <View marginLeft={5} marginRight={2}>
                    <TouchableOpacity onPress={() => onViewReplies(item.id)}>
                        <Text
                            style={styles.loadReplies}
                        >
                            View {item.commentReplyCount} Replies...
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {item.latestChildComments && item.latestChildComments.length > 0 && (
                <View
                    style={styles.childCommentView}
                >
                    <ChildComment
                        comment={item.latestChildComments[0]}
                        reactionLoading={childCommentLoading}
                        index={1}
                        isOp={post?.postedBy?.username === item.latestChildComments[0].createdBy.username}
                        onCommentReact={onReactToChildComment}
                        setOpenActionSheet={setIsChildOpen}
                    />
                    <CommentActionSheet
                        isOpen={isChildOpen}
                        onClose={() => setIsChildOpen(false)}
                        onDelete={() => {
                            setIsChildOpen(false);
                            onDeleteComment(item.latestChildComments[0].id, false);
                        }}
                        onRemove={() => {
                            setIsChildOpen(false);
                            onModeratorRemoval(item.latestChildComments[0].id, false);
                        }}
                        onEdit={() => {
                            setIsChildOpen(false);
                            onEditChildComment(item.latestChildComments[0]);
                        }}
                        onReport={() => {
                            setIsChildOpen(false);
                            setIsReportDialogOpen(true);
                        }}
                        isAdmin={isAdmin}
                        isModerator={isModerator}
                        isOwner={isOwner}
                    />
                </View>
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
    },
    loadReplies: {
        color: colorsVerifyCode.secondary,
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 15
    },
    childCommentView: {
        flexDirection: "column",
        flex: 1,
        marginLeft: "7%",
        marginRight: "7%",
        marginTop: 5,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: "#266186"
    }
});
