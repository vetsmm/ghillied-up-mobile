import React from "react";
import {SharedElement} from "react-navigation-shared-element";
import PostHeader from "../post-header";
import {TouchableOpacity} from "react-native";
import {colorsVerifyCode} from "../colors";
import {Text, View} from "native-base";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {PostDetailDto} from "../../shared/models/posts/post-detail.dto";
import {ReactionType} from "../../shared/models/reactions/reaction-type";
import {PostListingDto} from "../../shared/models/posts/post-listing.dto";
import {FlagCategory} from "../../shared/models/flags/flag-category";

export interface PostSharedElementProps {
    postId: string;
    post: PostDetailDto;
    reportPost: (category: FlagCategory, details: string) => void;
    onBookmarkPost: (post: PostListingDto | PostDetailDto) => void;
    ownerDeletePost: (post: PostListingDto | PostDetailDto) => void;
    moderatorRemovePost: (post: PostListingDto | PostDetailDto) => void;
    onHandleReaction: (postId: string, reaction: ReactionType | null) => void;
    isPostOwner: boolean;
    isAdmin: boolean;
    isModerator: boolean;
    navigation: any;
}

export const PostSharedElement = ({
                                      postId,
                                      post,
                                      reportPost,
                                      onBookmarkPost,
                                      ownerDeletePost,
                                      moderatorRemovePost,
                                      onHandleReaction,
                                      isPostOwner,
                                      isAdmin,
                                      isModerator,
                                      navigation
                                  }: PostSharedElementProps) => {
    return (
        <View mb={5}>
            <SharedElement id={`post#${postId}-Image`} style={{
                marginTop: 20,
                marginBottom: 15
            }}>
                {post && (
                    <PostHeader
                        post={post}
                        onBookmarkPost={onBookmarkPost}
                        onReport={reportPost}
                        onOwnerDelete={ownerDeletePost}
                        onModeratorRemoval={moderatorRemovePost}
                        onHandleReaction={onHandleReaction}
                        isOwner={isPostOwner}
                        isAdmin={isAdmin}
                        isModerator={isModerator}
                    />
                )}
            </SharedElement>
            <TouchableOpacity
                style={{
                    height: 50,
                    opacity: 0.8,
                    margin: 5,
                    backgroundColor: `rgba(0, 133, 131, 0.5)`,
                    borderRadius: 25,
                    borderWidth: 1,
                    borderColor: colorsVerifyCode.secondary
                }}
                onPress={() => {
                    navigation.navigate("Posts", {
                        screen: "CreatePostComment",
                        params: {
                            post,
                            parentComment: null
                        }
                    });
                }}
            >
                <View style={{
                    paddingLeft: 8,
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <MaterialCommunityIcons
                        name="reply"
                        size={30}
                        color="white"
                    />
                    <Text color="white"> Reply</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default PostSharedElement;
