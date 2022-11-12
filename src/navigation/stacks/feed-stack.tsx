import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {TouchableOpacity} from "react-native-gesture-handler";
import {FontAwesome} from "@expo/vector-icons";
import {Colors} from "../../shared/styles";
import PostListingScreen from "../../screens/feed/listing/post-listing-screen";

interface FeedScreenProps {
  name: string;
  route: string;
  component: React.FC;
  options?: any;
}

export const feedScreen: Array<FeedScreenProps> = [
  {
    name: "PostFeed",
    route: "post-feed",
    component: PostListingScreen,
    options: {
      headerShown: false
    }
  },
  {
    name: "HashTagFeed",
    route: "hashtag/:hashtag",
    component: PostListingScreen,
    options: {
      headerShown: false
    }
  }
];

export const getFeedScreenRoutes = () => {
  const routes: any = {};
  feedScreen.forEach((screen: any) => {
    routes[screen.name] = screen.route;
  });
  return routes;
};

const FeedStack = createNativeStackNavigator();

export default function FeedStackScreen({navigation}: any) {
  return (
    <FeedStack.Navigator>
      {/*<FeedStack.Screen*/}
      {/*  name="PostFeed"*/}
      {/*  component={PostListingScreen}*/}
      {/*  options={{*/}
      {/*    headerShown: false*/}
      {/*  }}*/}
      {/*/>*/}
      {feedScreen.map((screen: any) => (
        <FeedStack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </FeedStack.Navigator>
  );
}
