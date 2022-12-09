import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import CreatePostScreen from "../../screens/posts/create/create-post.screen";
import {PostDetailScreen} from "../../screens/posts/detail";
import PostCommentCreateScreen from "../../screens/comments/create";
import PostCommentUpdateScreen from "../../screens/comments/update";
import UpdatePostScreen from "../../screens/posts/update";
import ChildCommentUpdateScreen from '../../screens/comments/update-child';
import CreateChildCommentScreen from '../../screens/comments/create-child';
import CommentThreadScreen from '../../screens/comments/thread';
import {colorsVerifyCode} from '../../components/colors';

interface PostScreenProps {
  name: string;
  route: string;
  component: React.ComponentType<any>;
  options?: any;
  screenOptions?: any;
}

export const postScreens: Array<PostScreenProps> = [
  {
    name: "CreatePost",
    route: "create-post",
    component: CreatePostScreen,
    options: {
      title: "",
      headerShown: false
    }
  },
  {
    name: "PostDetail",
    route: "post-detail/:postId",
    screenOptions: {
        parse: {
            postId: postId => postId,
        }
    },
    component: PostDetailScreen,
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true
    }
  },
  {
    name: "UpdatePost",
    route: "update-post/:postId",
    component: UpdatePostScreen,
    options: {
      title: "",
      headerShown: false,
    }
  },
  {
    name: "CreatePostComment",
    route: "create-post-comment/:postId",
    component: PostCommentCreateScreen,
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true
    }
  },
  {
    name: "CreateChildComment",
    route: "create-child-comment/:parentCommentId",
    component: CreateChildCommentScreen,
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true
    }
  },
  {
    name: "UpdatePostComment",
    route: "update-post-comment/:commentId",
    component: PostCommentUpdateScreen,
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true
    }
  },
  {
    name: "UpdateChildComment",
    route: "update-child-comment/:childCommentId",
    component: ChildCommentUpdateScreen,
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true
    }
  },
  {
    name: "CommentThread",
    route: "comment-thread/:parentCommentId",
    component: CommentThreadScreen,
    options: {
      title: "Replies to Comment",
      headerShown: true,
      gestureEnabled: true,
      headerStyle: {
        backgroundColor: colorsVerifyCode.primary,
      },
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: colorsVerifyCode.white,
      },
      headerTintColor: colorsVerifyCode.white,
    }
  }
];

export const getPostScreenRoutes = () => {
  const routes: any = {};
  postScreens.forEach((screen: any) => {
    routes[screen.name] = {
      path: screen.path,
      ...screen.screenOptions
    };
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
