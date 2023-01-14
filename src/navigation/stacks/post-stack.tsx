import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import CreatePostScreen from "../../screens/posts/create/create-post.screen";
import PostDetailScreen from "../../screens/posts/detail";
import PostCommentCreateScreen from "../../screens/comments/create";
import PostCommentUpdateScreen from "../../screens/comments/update";
import UpdatePostScreen from "../../screens/posts/update";
import ChildCommentUpdateScreen from '../../screens/comments/update-child';
import CreateChildCommentScreen from '../../screens/comments/create-child';
import CommentThreadScreen from '../../screens/comments/thread';

interface PostScreenProps {
  name: string;
  path: string;
  parse?: any;
  stringify?: any;
  component: any;
  options?: any;
}

export const postScreens: Array<PostScreenProps> = [
  {
    name: "CreatePost",
    path: "create",
    component: CreatePostScreen,
    options: {
      title: "",
      headerShown: false
    }
  },
  {
    name: "PostDetail",
    path: "detail/:postId",
    component: PostDetailScreen,
    parse: {
      postId: postId => postId,
    },
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true
    }
  },
  {
    name: "UpdatePost",
    path: "update/:postId",
    component: UpdatePostScreen,
    options: {
      title: "",
      headerShown: false,
    }
  },
  {
    name: "CreatePostComment",
    path: "create-post-comment/:postId",
    component: PostCommentCreateScreen,
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true
    }
  },
  {
    name: "CreateChildComment",
    path: "create-child-comment/:parentCommentId",
    component: CreateChildCommentScreen,
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true
    }
  },
  {
    name: "UpdatePostComment",
    path: "update-post-comment/:commentId",
    component: PostCommentUpdateScreen,
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true
    }
  },
  {
    name: "UpdateChildComment",
    path: "update-child-comment/:childCommentId",
    component: ChildCommentUpdateScreen,
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true
    }
  },
  {
    name: "CommentThread",
    path: "comment-thread/:parentCommentId",
    component: CommentThreadScreen,
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true,
    }
  }
];

export const getPostScreenRoutes = () => {
  const routes: any = {};
  postScreens.forEach((screen: any) => {
    routes[screen.name] = screen.path;
  });
  return routes;
};

const PostStack = createNativeStackNavigator();

export default function PostStackScreen() {
  return (
    <PostStack.Navigator>
      {postScreens.map((screen: any) => (
        <PostStack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </PostStack.Navigator>
  );
}
