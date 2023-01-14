import React from "react";
import {
    Text,
    HStack,
    VStack,
    IconButton,
    Icon,
    Avatar,
    View, Box, Spinner
} from "native-base";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import {getMilitaryString} from "../../shared/utils/military-utils";
import RegularText from "../texts/regular-texts";
import SmallText from "../texts/small-text";
import {getTimeAgoShort} from "../../shared/utils/date-utils";
import ReactionButton from "../buttons/reaction-button";
import CommentButton from "../buttons/comment-button";
import PostActionSheet from "../bottom-sheets/post-action-sheet";
import {useNavigation} from "@react-navigation/native";
import {ReportMenuDialog} from "../reporting/report-menu-dialog";
import {numberToReadableFormat} from "../../shared/utils/number-utils";
import {ReactionType} from "../../shared/models/reactions/reaction-type";
import {FlagCategory} from "../../shared/models/flags/flag-category";
import flagService from "../../shared/services/flag.service";
import {PostFeedDto} from "../../shared/models/feed/post-feed.dto";
import {colorsVerifyCode} from "../colors";
import {TouchableOpacity} from "react-native";
import PostService from "../../shared/services/post.service";
import {PostContent} from '../post-content';
import ShareUtils from "../../shared/utils/share-utils";
import postService from "../../shared/services/post.service";
import {FlashMessageRef} from "../flash-message/index";

export interface IPostCardProps {
    isPinnable?: boolean;
    post: PostFeedDto;
    isOwner?: boolean;
    isAdmin?: boolean;
    isModerator?: boolean;
    isLoadingReactionUpdate?: boolean;
    onOwnerDelete: (post: PostFeedDto) => void;
    onModeratorRemoval: (post: PostFeedDto) => void;
    onHandleReaction: (postId: string, reaction: ReactionType | null) => void;
    isGhillieMember?: boolean;
    shouldTruncate?: boolean;
    isVerified?: boolean;
}

export const PostFeedCard = ({
                                 post,
                                 onModeratorRemoval,
                                 onOwnerDelete,
                                 onHandleReaction,
                                 isLoadingReactionUpdate,
                                 isAdmin,
                                 isOwner,
                                 isModerator,
                                 isPinnable = false,
                                 isGhillieMember = true,
                                 shouldTruncate = true,
                                 isVerified = true,
                             }: IPostCardProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isReportDialogOpen, setIsReportDialogOpen] = React.useState(false);

    const cancelRef = React.useRef(null);
    const navigation: any = useNavigation();

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    const onBookmarkPost = (post) => {
        PostService.bookmarkPost(post.id)
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
            .catch(err => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while bookmarking the post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

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

    const reportPost = (category: FlagCategory, details: string) => {
        flagService.flagPost({
            postId: post.id,
            flagCategory: category,
            details
        }).then(() => {
            FlashMessageRef.current?.showMessage({
                title: 'Post reported',
                message: 'Thank you for reporting this post. We will review it shortly.',
                type: 'success',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }).catch(err => {
            FlashMessageRef.current?.showMessage({
                message: 'An error occurred while reporting this post. Please try again later.',
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        });
    };

    const _renderReactionButton = () => {
        if (isGhillieMember) {
            return (
                <ReactionButton
                    onReact={(reaction) => {
                        onHandleReaction(post.id, reaction);
                    }}
                    onUnReact={() => {
                        onHandleReaction(post.id, null);
                    }}
                    currentReaction={post.currentUserReactionType}
                />
            )
        }

        return null;
    }

    return (
        <TouchableOpacity
            onPress={() => moveTo("Posts", {params: {postId: post.id}, screen: "PostDetail"})}
            disabled={!!post.linkMeta?.video || !isGhillieMember}
        >
            <Box
                flexDirection="column"
                pt={{base: 7, md: 4}}
                pb={{base: 8, md: 4}}
                mt={{md: 3}}
                ml={3}
                mr={3}
                // rounded={{ md: 'sm' }}
                rounded={"lg"}
                borderColor={"#00C6B1"}
                borderWidth={3}
                marginBottom={5}
                roundedBottomLeft={20}
                roundedBottomRight={20}
                roundedTopLeft={20}
                roundedTopRight={20}
                backgroundColor={colorsVerifyCode.dialogPrimary}
            >
                <HStack justifyContent="space-between">
                    <HStack space={2} alignItems="center" px="4">
                        <Avatar
                            borderWidth="1"
                            borderColor={colorsVerifyCode.secondary}
                            source={
                                post.ghillieImageUrl
                                    ? {uri: post.ghillieImageUrl}
                                    : require("../../../assets/logos/icon.png")
                            }
                            width="10"
                            height="10"
                        />
                        <VStack>
                            <Text fontSize="sm" fontWeight="semibold" color={colorsVerifyCode.secondary}>
                                <AntDesign name="caretright" size={10} color={colorsVerifyCode.secondary}/>
                                {` ${post.ghillieName}`}
                            </Text>

                            <Text
                                _light={{color: "coolGray.300"}}
                                _dark={{color: "coolGray.200"}}
                                fontSize="xs"
                            >
                                {getMilitaryString(post.ownerBranch, post.ownerServiceStatus)}
                            </Text>
                        </VStack>
                    </HStack>
                    <View style={{
                        width: 100,
                        marginRight: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start"
                    }}>
                        <SmallText>
                            {getTimeAgoShort(post.createdDate)}
                        </SmallText>
                        {isVerified && (
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
                        )}
                    </View>
                </HStack>

                <VStack px="4" space={1} pt={6}>
                    <RegularText style={{
                        marginBottom: 5,
                        fontSize: 20,
                        fontWeight: "bold"
                    }}>
                        {post.title}
                    </RegularText>

                    <PostContent
                        shouldTruncate={shouldTruncate}
                        content={post.content}
                        linkMeta={post.linkMeta}
                    />

                    <SmallText style={{marginTop: 5}}>
                        {post.postReactionsCount > 0
                            ? `${numberToReadableFormat(post.postReactionsCount)} reaction(s)`
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
                    mt={2}
                >
                    {isLoadingReactionUpdate ? (
                        <Spinner size="small" color="white"/>
                    ) : _renderReactionButton()}
                    <CommentButton
                        disabled={!isGhillieMember}
                        onPress={() => {
                            moveTo("Posts", {params: {postId: post.id}, screen: "PostDetail"});
                        }}
                        numberOfComments={post.postCommentsCount}
                    />
                </HStack>

                <PostActionSheet
                    isOpen={isOpen}
                    isPinnable={isPinnable}
                    isPinned={post.isPinned}
                    onClose={() => setIsOpen(false)}
                    onPinPost={() => {
                        setIsOpen(false);
                        onPinPost(post.id);
                    }}
                    onUnpinPost={() => {
                        setIsOpen(false);
                        onUnpinPost(post.id);
                    }}
                    onDelete={() => {
                        setIsOpen(false);
                        onOwnerDelete(post);
                    }}
                    onRemove={() => {
                        setIsOpen(false);
                        onModeratorRemoval(post);
                    }}
                    onBookmark={() => {
                        setIsOpen(false);
                        onBookmarkPost(post);
                    }}
                    onViewGhillie={() => {
                        setIsOpen(false);
                        moveTo("Ghillies", {
                            screen: "GhillieDetail",
                            params: {ghillieId: post.ghillieId}
                        });
                    }}
                    onReport={() => {
                        setIsOpen(false);
                        setIsReportDialogOpen(true);
                    }}
                    onEdit={() => {
                        setIsOpen(false);
                        moveTo("Posts", {
                            params: {post: post, ghillieImageUrl: post.ghillieImageUrl},
                            screen: "UpdatePost"
                        });
                    }}
                    onShare={async () => {
                        await ShareUtils.sharePost(post);
                        setIsOpen(false);
                    }}
                    isAdmin={isAdmin}
                    isModerator={isModerator}
                    isOwner={isOwner}
                    isGhillieMember={isGhillieMember}
                />

                <ReportMenuDialog
                    isOpen={isReportDialogOpen}
                    onClose={() => setIsReportDialogOpen(false)}
                    cancelRef={cancelRef}
                    onReport={reportPost}
                />
            </Box>
        </TouchableOpacity>
    );
};

export default PostFeedCard;
