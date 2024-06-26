import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import PostListingScreen from "../../screens/feed/listing/post-listing-screen";
import HashTagPostListingScreen from '../../screens/feed/hashtag';

interface FeedScreenProps {
    name: string;
    path: string;
    parse?: any;
    stringify?: any;
    component: any;
    options?: any;
}

export const feedScreen: Array<FeedScreenProps> = [
    {
        name: "PostFeed",
        path: "",
        component: PostListingScreen,
        options: {
            headerShown: false
        }
    },
    {
        name: "HashTagFeed",
        path: "hashtag/:hashtag",
        parse: {
            hashtag: hashtag => hashtag.replace(/^#/, ''),
        },
        component: HashTagPostListingScreen,
        options: {
            headerShown: false
        }
    }
];

export const getFeedScreenRoutes = () => {
    const routes: any = {};
    feedScreen.forEach((screen: FeedScreenProps) => {
        routes[screen.name] = screen.path;
    });
    return routes;
};

const FeedStack = createNativeStackNavigator();

export default function FeedStackScreen() {
    return (
        <FeedStack.Navigator>
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
