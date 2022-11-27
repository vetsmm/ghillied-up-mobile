import React from "react";
import {SharedElement} from "react-navigation-shared-element";
import {View} from "native-base";
import {PostDetailDto} from "../../shared/models/posts/post-detail.dto";
import PostHeaderNoActions from "../post-header-no-actions";

export interface PostSharedElementNoActionsProps {
  post: PostDetailDto;
}

export const PostSharedElementNoActions = ({post}: PostSharedElementNoActionsProps) => {
  return (
    <View mb={5}>
      <SharedElement id={`post#${post?.id}-Image`} style={{
        marginTop: 20,
      }}>
        {post && (
          <PostHeaderNoActions post={post} />
        )}
      </SharedElement>
    </View>
  )
}

export default PostSharedElementNoActions;
