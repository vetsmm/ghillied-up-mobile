import React, {useEffect, useRef} from "react";
import {
    Text,
    HStack,
    VStack,
    IconButton,
    Icon,
    Avatar,
    View, Box
} from "native-base";
import {MaterialIcons} from "@expo/vector-icons";
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
import {SuccessAlert} from "../alerts/success-alert";
import {PostFeedDto} from "../../shared/models/feed/post-feed.dto";

export interface IPostCardProps {
    post: PostFeedDto;
    isOwner?: boolean;
    isAdmin?: boolean;
    isModerator?: boolean;
    onOwnerDelete: (post: PostFeedDto) => void;
    onModeratorRemoval: (post: PostFeedDto) => void;
    onHandleReaction: (postId: string, reaction: ReactionType | null) => void;
}

export const PostFeedCard = ({
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

    const cancelRef = React.useRef(null);
    const navigation: any = useNavigation();

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    useEffect(() => {
        if (showReportAlert) {
            setTimeout(() => {
                setShowReportAlert(false);
            }, 3000);
        }
    }, [showReportAlert]);

    const reportPost = (category: FlagCategory, details: string) => {
        flagService.flagPost({
            postId: post.id,
            flagCategory: category,
            details
        })
            .finally(() => {
                setShowReportAlert(true);
            });
    };

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
                            post.ghillieImageUrl
                                ? {uri: post.ghillieImageUrl}
                                : require("../../../assets/logos/icon.png")
                        }
                        width="10"
                        height="10"
                    />
                    <VStack>
                        <Text fontSize="sm" fontWeight="semibold" color={"white"}>
                            {post.ownerUsername}
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
                <ReactionButton
                    onReact={(reaction) => {
                        onHandleReaction(post.id, reaction);
                    }}
                    onUnReact={() => {
                        onHandleReaction(post.id, null);
                    }}
                    currentReaction={post.currentUserReactionType}
                />
                <CommentButton
                    onPress={() => {
                        moveTo("Posts", {params: {postId: post.id,}, screen: "PostDetail"});
                    }}
                    numberOfComments={post.postCommentsCount}
                />
            </HStack>

            {showReportAlert && (
                <SuccessAlert
                    title="Report Sent"
                    body="Thank you for reporting this post. We appreciate your help in keeping our community safe. If appropriate, we will take the necessary actions."
                />
            )}

            <PostActionSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
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
                    moveTo("GhillieDetail", {ghillieId: post.ghillieId});
                }}
                onReport={() => {
                    setIsOpen(false);
                    setIsReportDialogOpen(true);
                }}
                onEdit={() => {
                    setIsOpen(false);
                    moveTo("Posts", {params: {post: post, ghillieImageUrl: post.ghillieImageUrl}, screen: "UpdatePost"});
                }}
                isAdmin={isAdmin}
                isModerator={isModerator}
                isOwner={isOwner}
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

export default PostFeedCard;
