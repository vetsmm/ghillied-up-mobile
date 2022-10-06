import React from "react";
import {
  Text,
  HStack,
  VStack,
  Avatar,
  View
} from "native-base";
import {PostListingDto} from "../../shared/models/posts/post-listing.dto";
import {getMilitaryString} from "../../shared/utils/military-utils";
import BigText from "../texts/big-text";
import RegularText from "../texts/regular-texts";
import SmallText from "../texts/small-text";
import {getTimeAgo} from "../../shared/utils/date-utils";
import {PostDetailDto} from "../../shared/models/posts/post-detail.dto";

export interface IPostCardNoActionsProps {
  post: PostListingDto | PostDetailDto;
}

export const PostHeaderNoActions = ({post}: IPostCardNoActionsProps) => {
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
        }}
        >
          <SmallText>
            {getTimeAgo(post.createdDate)}
          </SmallText>
        </View>
      </HStack>

      <VStack px="10" space={1} pt={6}>
        <BigText style={{
          marginBottom: 5
        }}>
          {post.title}
        </BigText>
        <RegularText style={{flex: 1, flexWrap: "wrap"}}>
          {post.content}
        </RegularText>
      </VStack>
    </View>
  );
};

export default PostHeaderNoActions;
