import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import {Colors} from "../../shared/styles";
import PostListingScreen from "../../screens/feed/listing/post-listing-screen";

interface FeedScreenProps {
  name: string;
  route: string;
}

export const feedScreen: Array<FeedScreenProps> = [
  {
    name: "PostFeed",
    route: "post-feed",
  }
];

export const getFeedScreenRoutes = () => {
  const routes:any = {};
  feedScreen.forEach((screen: any) => {
    routes[screen.name] = screen.route;
  });
  return routes;
};

const FeedStack = createNativeStackNavigator();

export default function FeedStackScreen({ navigation }: any) {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        name="PostFeed"
        component={PostListingScreen}
        options={{
          headerShown: false,
        }}
      />
    </FeedStack.Navigator>
  );
}
