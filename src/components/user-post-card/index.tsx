import React from "react";
import {
    HStack,
    VStack,
    Avatar,
    View, Box
} from "native-base";
import RegularText from "../texts/regular-texts";
import SmallText from "../texts/small-text";
import {getTimeAgo} from "../../shared/utils/date-utils";
import {PostFeedDto} from "../../shared/models/feed/post-feed.dto";
import stringUtils from "../../shared/utils/string.utils";

export interface IPostCardProps {
    post: PostFeedDto;
}

export const UserPostCard = ({post}: IPostCardProps) => {
    return (
        <Box
            flexDirection="column"
            pt={{base: 1, md: 1}}
            pb={{base: 1, md: 1}}
            mt={{md: 3}}
            ml={3}
            mr={3}
            // rounded={{ md: 'sm' }}
            rounded={"lg"}
            borderColor={"#00C6B1"}
            borderWidth={1}
            marginBottom={5}
            roundedBottomLeft={20}
            roundedBottomRight={20}
            roundedTopLeft={20}
            roundedTopRight={20}
        >
            <HStack justifyContent="space-between">
                <HStack alignItems="center" px="4">
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
                    <RegularText style={{
                        marginLeft: 10,
                    }}>
                        {post.ghillieName}
                    </RegularText>
                </HStack>
                <View style={{
                    width: 100,
                    marginRight: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                }}>
                    <SmallText>
                        {getTimeAgo(post.createdDate)}
                    </SmallText>
                </View>
            </HStack>

            <VStack px="4" space={1} alignItems="center">
                <RegularText style={{
                    marginBottom: 5,
                    fontSize: 15,
                    fontWeight: "bold",
                }}>
                    {post.title}
                </RegularText>
                <RegularText style={{flex: 1, flexWrap: "wrap"}}>
                    {stringUtils.trimString(post.content, 100)}
                </RegularText>
            </VStack>
        </Box>
    );
};

export default UserPostCard;
