import React from "react";
import {
    Text,
    HStack,
    VStack,
    IconButton,
    Icon,
    Avatar,
    View, Box
} from "native-base";
import {PostListingDto} from "../../shared/models/posts/post-listing.dto";
import {MaterialIcons} from "@expo/vector-icons";
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
import flagService from "../../shared/services/flag.service";
import {SuccessAlert} from "../alerts/success-alert";
import ShareUtils from "../../shared/utils/share-utils";
import postService from "../../shared/services/post.service";
import PostService from "../../shared/services/post.service";
import {FlashMessageRef} from "../flash-message/index";

export interface IPostCardProps {
    post: PostListingDto | PostDetailDto;
    isOwner?: boolean;
    isAdmin?: boolean;
    isModerator?: boolean;
    onOwnerDelete: (post: PostListingDto | PostDetailDto) => void;
    onModeratorRemoval: (post: PostListingDto | PostDetailDto) => void;
    onHandleReaction: (postId: string, reaction: ReactionType | null) => void;
}

export const PostCard = ({
                             post,
                             onModeratorRemoval,
                             onOwnerDelete,
                             onHandleReaction,
                             isAdmin,
                             isOwner,
                             isModerator
                         }: IPostCardProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isReportDialogOpen, setIsReportDialogOpen] = React.useState(false);
    const [showReportAlert, setShowReportAlert] = React.useState(false);
    const [showBookmarkAlert, setShowBookmarkAlert] = React.useState(false);

    const cancelRef = React.useRef(null);
    const navigation: any = useNavigation();

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    const reportPost = (category: FlagCategory, details: string) => {
        flagService.flagPost({
            postId: post.id,
            flagCategory: category,
            details
        })
            .then(() => {
                setShowReportAlert(true);
            })
            .catch((err) => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while reporting the post',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    };

    const onBookmarkPost = (postId) => {
        PostService.bookmarkPost(postId)
            .then(() => {
                setShowBookmarkAlert(true);
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

    return (
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
        >
            <HStack justifyContent="space-between">
                <HStack space={2} alignItems="center" px="4">
                    <Avatar
                        borderWidth="1"
                        _light={{borderColor: "primary.900"}}
                        _dark={{borderColor: "primary.700"}}
                        source={
                            post.ghillie?.imageUrl
                                ? {uri: post.ghillie?.imageUrl}
                                : require("../../../assets/logos/icon.png")
                        }
                        width="10"
                        height="10"
                    />
                    <VStack>
                        <Text fontSize="sm" fontWeight="semibold" color={"white"}>
                            {post.postedBy.username}
                        </Text>

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
                    paddingLeft: 8,
                    width: 100,
                    flex: 1,
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

            <VStack px="4" space={1} pt={6}>
                <RegularText style={{
                    marginBottom: 5,
                    fontSize: 20,
                    fontWeight: "bold",
                }}>
                    {post.title}
                </RegularText>
                <RegularText style={{flex: 1, flexWrap: "wrap"}}>
                    {post.content}
                </RegularText>
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
                <ReactionButton
                    onReact={(reaction) => {
                        onHandleReaction(post.id, reaction);
                    }}
                    onUnReact={() => {
                        onHandleReaction(post.id, null);
                    }}
                    currentReaction={post.currentUserReaction}
                />
                <CommentButton
                    onPress={() => {
                        moveTo("Posts", {params: {postId: post.id,}, screen: "PostDetail"});
                    }}
                    numberOfComments={post.numberOfComments}
                />
            </HStack>

            {showReportAlert && (
                <SuccessAlert
                    title="Report Sent"
                    body="Thank you for reporting this post. We appreciate your help in keeping our community safe. If appropriate, we will take the necessary actions."
                />
            )}

            {showBookmarkAlert && (
                <SuccessAlert
                    title="Bookmarked!"
                    body="Post has been bookmarked!"
                />
            )}

            <PostActionSheet
                isPinned={post.isPinned}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onPinPost={() => {
                    onPinPost(post.id)
                    setIsOpen(false);
                }}
                onUnpinPost={() => {
                    onUnpinPost(post.id)
                    setIsOpen(false);
                }}
                onBookmark={() => {
                    onBookmarkPost(post.id)
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
                    moveTo("GhillieDetail", {ghillieId: post.ghillie.id});
                }}
                onShare={async () => {
                    await ShareUtils.sharePost(post);
                    setIsOpen(false);
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
                isAdmin={isAdmin}
                isModerator={isModerator}
                isOwner={isOwner}
                isGhillieMember={true}
            />

            <ReportMenuDialog
                isOpen={isReportDialogOpen}
                onClose={() => setIsReportDialogOpen(false)}
                cancelRef={cancelRef}
                onReport={reportPost}
            />
        </Box>
    );
};

export default PostCard;
