import React from "react";
import {
    Text,
    HStack,
    VStack,
    Pressable,
    IconButton,
    Icon,
    Avatar,
    View, Spinner
} from "native-base";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import {getMilitaryString} from "../../shared/utils/military-utils";
import RegularText from "../texts/regular-texts";
import SmallText from "../texts/small-text";
import {getTimeAgo} from "../../shared/utils/date-utils";
import ReactionButton from "../buttons/reaction-button";
import CommentButton from "../buttons/comment-button";
import PostActionSheet from "../bottom-sheets/post-action-sheet";
import {useNavigation} from "@react-navigation/native";
import {ReportMenuDialog} from "../reporting/report-menu-dialog";
import {numberToReadableFormat} from "../../shared/utils/number-utils";
import {ReactionType} from "../../shared/models/reactions/reaction-type";
import {PostDetailDto} from "../../shared/models/posts/post-detail.dto";
import {FlagCategory} from "../../shared/models/flags/flag-category";
import {colorsVerifyCode} from '../colors';
import {PostContent} from '../post-content';
import ShareUtils from "../../shared/utils/share-utils";
import postService from "../../shared/services/post.service";
import {FlashMessageRef} from "../flash-message/index";
import PostService from "../../shared/services/post.service";

export interface IPostCardProps {
    post: PostDetailDto;
    isOwner?: boolean;
    isAdmin?: boolean;
    isModerator?: boolean;
    onBookmarkPost: (post: PostDetailDto) => void;
    onReport: (category: FlagCategory, details: string) => void;
    onOwnerDelete: (post: PostDetailDto) => void;
    onModeratorRemoval: (post: PostDetailDto) => void;
    onHandleReaction: (postId: string, reaction: ReactionType | null) => void;
    reactionLoading?: boolean;
    onSubscribe: (postId: string) => void;
    onUnsubscribe: (postId: string) => void;
}

export const PostHeader = ({
                               post,
                               onModeratorRemoval,
                               onBookmarkPost,
                               onOwnerDelete,
                               onHandleReaction,
                               onSubscribe,
                               onUnsubscribe,
                               onReport,
                               isAdmin,
                               isOwner,
                               isModerator,
                               reactionLoading = false
                           }: IPostCardProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isReportDialogOpen, setIsReportDialogOpen] = React.useState(false);

    const cancelRef = React.useRef(null);
    const navigation: any = useNavigation();

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    const onPinPost = (postId) => {
        postService.pinPost(postId)
            .then(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'Post pinned to Ghillie',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .catch(err => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while pinning the post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    const onUnpinPost = (postId) => {
        postService.unpinPost(postId)
            .then(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'Post unpinned from Ghillie',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .catch(err => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while unpinning the post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    return (
        <View
            flexDirection="column"
        >
            <HStack justifyContent="space-between">
                <HStack space={2} alignItems="center" px="8">
                    <Avatar
                        borderWidth="1"
                        borderColor={colorsVerifyCode.secondary}
                        source={
                            post.ghillie?.imageUrl
                                ? {uri: post.ghillie?.imageUrl}
                                : require("../../../assets/logos/icon.png")
                        }
                        width="10"
                        height="10"
                    />
                    <VStack>
                        <Pressable
                            onPress={() => {
                                moveTo("Ghillies", {screen: "GhillieDetail", params: {ghillieId: post.ghillie.id}});
                            }}
                        >
                            <Text fontSize="sm" fontWeight="semibold" color={colorsVerifyCode.secondary}>
                                <AntDesign name="caretright" size={10} color={colorsVerifyCode.secondary}/>
                                {` ${post.ghillie.name}`}
                            </Text>
                        </Pressable>

                        <Text
                            _light={{color: "coolGray.300"}}
                            _dark={{color: "coolGray.200"}}
                            fontSize="xs"
                        >
                            {getMilitaryString(post.postedBy.branch, post.postedBy.serviceStatus)}
                        </Text>
                    </VStack>
                </HStack>
                <View style={{
                    width: 100,
                    marginRight: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                }}>
                    <SmallText>
                        {getTimeAgo(post.createdDate)}
                    </SmallText>
                    <IconButton
                        variant="unstyled"
                        icon={
                            <Icon
                                size="6"
                                as={MaterialIcons}
                                name={"more-vert"}
                                color={"white"}
                            />
                        }
                        onPress={() => setIsOpen(true)}
                    />
                </View>
            </HStack>

            <VStack px="10" space={1} pt={6}>
                <RegularText style={{
                    marginBottom: 5,
                    fontSize: 20,
                    fontWeight: "bold",
                }}>
                    {post.title}
                </RegularText>

                <PostContent
                    content={post.content}
                    linkMeta={post.linkMeta}
                    metadataContainerStyle={{
                        backgroundColor: colorsVerifyCode.dialogPrimary
                    }}
                />

                <SmallText>
                    {post.numberOfReactions > 0
                        ? `${numberToReadableFormat(post.numberOfReactions)} reaction(s)`
                        : ""
                    }
                </SmallText>
            </VStack>

            <HStack
                flex={1}
                flexDirection={"row"}
                justifyContent="center"
                alignItems="space-between"
                px="4"
                mt={10}
            >
                {reactionLoading ? (
                    <Spinner color={colorsVerifyCode.secondary}/>
                ) : (
                    <ReactionButton
                        onReact={(reaction) => {
                            onHandleReaction(post.id, reaction);
                        }}
                        onUnReact={() => {
                            onHandleReaction(post.id, null);
                        }}
                        currentReaction={post.currentUserReaction}
                    />
                )}

                <CommentButton
                    onPress={() => {
                        moveTo("Posts", {params: {postId: post.id,}, screen: "PostDetail"});
                    }}
                    numberOfComments={post.numberOfComments}
                />
            </HStack>

            <PostActionSheet
                isPinned={post.isPinned}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                isSubscribed={post.isSubscribed}
                onSubscribe={() => {
                    onSubscribe(post.id);
                    setIsOpen(false);
                }}
                onUnsubscribe={() => {
                    onUnsubscribe(post.id);
                    setIsOpen(false);
                }}
                onPinPost={() => {
                    onPinPost(post.id);
                    setIsOpen(false);
                }}
                onUnpinPost={() => {
                    onUnpinPost(post.id);
                    setIsOpen(false);
                }}
                onDelete={() => {
                    setIsOpen(false);
                    onOwnerDelete(post);
                }}
                onRemove={() => {
                    setIsOpen(false);
                    onModeratorRemoval(post);
                }}
                onViewGhillie={() => {
                    setIsOpen(false);
                    moveTo("Ghillies", {screen: "GhillieDetail", params: {ghillieId: post.ghillie.id}});
                }}
                onReport={() => {
                    setIsOpen(false);
                    setIsReportDialogOpen(true);
                }}
                onEdit={() => {
                    setIsOpen(false);
                    moveTo("Posts", {
                        params: {post: post, ghillieImageUrl: post.ghillie.imageUrl},
                        screen: "UpdatePost"
                    });
                }}
                onBookmark={() => {
                    setIsOpen(false);
                    onBookmarkPost(post);
                }}
                onShare={async () => {
                    await ShareUtils.sharePost(post);
                    setIsOpen(false);
                }}
                isAdmin={isAdmin}
                isModerator={isModerator}
                isOwner={isOwner}
                isGhillieMember={true}
            />

            <ReportMenuDialog
                isOpen={isReportDialogOpen}
                onClose={() => setIsReportDialogOpen(false)}
                cancelRef={cancelRef}
                onReport={onReport}
            />
        </View>
    );
};

export default PostHeader;
