import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreatePostScreen from "../../screens/posts/create/create-post.screen";
import {PostDetailScreen} from "../../screens/posts/detail";
import PostCommentCreateScreen from "../../screens/comments/create";
import PostCommentUpdateScreen from "../../screens/comments/update";

interface PostScreenProps {
  name: string;
  route: string;
  component: React.ComponentType<any>;
  options?: any;
}

export const postScreens: Array<PostScreenProps> = [
  {
    name: "CreatePost",
    route: "create",
    component: CreatePostScreen,
    options: {
      title: "",
      headerShown: false,
    },
  },
];

export const getPostScreenRoutes = () => {
  const routes:any = {};
  postScreens.forEach((screen: any) => {
    routes[screen.name] = screen.route;
  });
  return routes;
};

const PostStack = createNativeStackNavigator();

export default function PostStackScreen() {
  return (
    <PostStack.Navigator>
      <PostStack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <PostStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          title: "",
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <PostStack.Screen
        name="CreatePostComment"
        component={PostCommentCreateScreen}
        options={{
          title: "",
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <PostStack.Screen
        name="UpdatePostComment"
        component={PostCommentUpdateScreen}
        options={{
          title: "",
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </PostStack.Navigator>
  );
}
