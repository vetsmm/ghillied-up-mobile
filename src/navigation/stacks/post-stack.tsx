import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import CreatePostScreen from "../../screens/posts/create/create-post.screen";
import {PostDetailScreen} from "../../screens/posts/detail";
import PostCommentCreateScreen from "../../screens/comments/create";
import PostCommentUpdateScreen from "../../screens/comments/update";
import UpdatePostScreen from "../../screens/posts/update";

interface PostScreenProps {
  name: string;
  route: string;
  component: React.ComponentType<any>;
  options?: any;
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
    name: "UpdatePostComment",
    route: "update-post-comment/:postId",
    component: PostCommentUpdateScreen,
    options: {
      title: "",
      headerShown: false,
      gestureEnabled: true
    }
  }
];

export const getPostScreenRoutes = () => {
  const routes: any = {};
  postScreens.forEach((screen: any) => {
    routes[screen.name] = screen.route;
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
      {/*<PostStack.Screen*/}
      {/*  name="CreatePost"*/}
      {/*  // @ts-ignore*/}
      {/*  component={CreatePostScreen}*/}
      {/*  options={{*/}
      {/*    title: "",*/}
      {/*    headerShown: false*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<PostStack.Screen*/}
      {/*  name="UpdatePost"*/}
      {/*  // @ts-ignore*/}
      {/*  component={UpdatePostScreen}*/}
      {/*  options={{*/}
      {/*    title: "",*/}
      {/*    headerShown: false*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<PostStack.Screen*/}
      {/*  name="PostDetail"*/}
      {/*  // @ts-ignore*/}
      {/*  component={PostDetailScreen}*/}
      {/*  options={{*/}
      {/*    title: "",*/}
      {/*    headerShown: false,*/}
      {/*    gestureEnabled: true*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<PostStack.Screen*/}
      {/*  name="CreatePostComment"*/}
      {/*  // @ts-ignore*/}
      {/*  component={PostCommentCreateScreen}*/}
      {/*  options={{*/}
      {/*    title: "",*/}
      {/*    headerShown: false,*/}
      {/*    gestureEnabled: true*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<PostStack.Screen*/}
      {/*  name="UpdatePostComment"*/}
      {/*  // @ts-ignore*/}
      {/*  component={PostCommentUpdateScreen}*/}
      {/*  options={{*/}
      {/*    title: "",*/}
      {/*    headerShown: false,*/}
      {/*    gestureEnabled: true*/}
      {/*  }}*/}
      {/*/>*/}
    </PostStack.Navigator>
  );
}
