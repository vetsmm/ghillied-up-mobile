import React from "react";
import {
  Text,
  HStack,
  VStack,
  Pressable,
  Card,
  IconButton,
  Icon,
  Avatar,
  View
} from "native-base";
import {PostListingDto} from "../../shared/models/posts/post-listing.dto";
import {MaterialIcons} from "@expo/vector-icons";
import {getMilitaryString} from "../../shared/utils/military-utils";
import BigText from "../texts/big-text";
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

export interface IPostCardProps {
  post: PostListingDto | PostDetailDto;
  isOwner?: boolean;
  isAdmin?: boolean;
  isModerator?: boolean;
  onReport: (category: FlagCategory, details: string) => void;
  onOwnerDelete: (post: PostListingDto | PostDetailDto) => void;
  onModeratorRemoval: (post: PostListingDto | PostDetailDto) => void;
  onHandleReaction: (postId: string, reaction: ReactionType | null) => void;
}

export const PostHeader = ({
                             post,
                             onModeratorRemoval,
                             onOwnerDelete,
                             onHandleReaction,
                             onReport,
                             isAdmin,
                             isOwner,
                             isModerator
                           }: IPostCardProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = React.useState(false);

  const cancelRef = React.useRef(null);
  const navigation: any = useNavigation();

  const moveTo = (screen, payload?) => {
    navigation.navigate(screen, {...payload});
  };

  return (
    <View
      flexDirection="column"
    >
      <HStack justifyContent="space-between">
        <HStack space={2} alignItems="center" px="8">
          <Avatar
            borderWidth="1"
            _light={{borderColor: "primary.900"}}
            _dark={{borderColor: "primary.700"}}
            source={{uri: post.ghillie?.imageUrl ? post.ghillie?.imageUrl : "https://picsum.photos/1000"}}
            width="10"
            height="10"
          />
          <VStack>
            <Pressable
              onPress={() => {
                console.log(`${post.postedBy.username} clicked`);
              }}
            >
              <Text fontSize="sm" fontWeight="semibold" color={"white"}>
                {post.postedBy.username}
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
          paddingLeft: 8,
          width: 100,
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
        >
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
          moveTo("Ghillies", {screen: "GhillieDetail", params: {ghillieId: post.ghillie.id}});
        }}
        onReport={() => {
          setIsOpen(false);
          setIsReportDialogOpen(true);
        }}
        onEdit={() => {
          setIsOpen(false);
          //Todo: implement
          console.log("Edit");
        }}
        isAdmin={isAdmin}
        isModerator={isModerator}
        isOwner={isOwner}
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
