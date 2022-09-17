import React from "react";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image, View } from "native-base";
import styles from "./application-tab-bar.styles";
import {Colors} from "../../shared/styles";
import FeedStackScreen from "../../navigation/stacks/feed-stack";
import GhillieStackScreen from "../../navigation/stacks/ghillie-stack";
import NotificationStackScreen from "../../navigation/stacks/notification-stack";
import AccountStackScreen from "../../navigation/stacks/account-stack";
import PostStackScreen from "../../navigation/stacks/post-stack";
import {useSelector} from "react-redux";
import {IRootState} from "../../store";

const Tab = createBottomTabNavigator();

const CustomTabBarButton = (props: any) => {
  return (
    <TouchableOpacity style={styles.customButton} onPress={props.onPress}>
      <View style={styles.customButtonView}>{props.children}</View>
    </TouchableOpacity>
  );
};

export const ApplicationTabBar = ({ navigation }: any) => {
  const isAuthenticated = useSelector(
    (state: IRootState) => state.authentication.isVerifiedMilitary,
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let library = "MaterialCommunityIcons";

          if (route.name === "My Feed") {
            iconName = focused
              ? "newspaper-variant"
              : "newspaper-variant-outline";
          } else if (route.name === "Ghillies") {
            iconName = focused ? "account-group" : "account-group-outline";
          } else if (route.name === "Notifications") {
            library = "Ionicons";
            iconName = focused
              ? "notifications-sharp"
              : "notifications-outline";
          } else if (route.name === "Account") {
            library = "FontAwesome";
            iconName = focused ? "user-circle-o" : "user-circle";
          }

          // You can return any component that you like here!
          if (library === "MaterialCommunityIcons") {
            return (
              <MaterialCommunityIcons
                // @ts-ignore
                name={iconName}
                size={size}
                color={color}
              />
            );
          } else if (library === "Ionicons") {
            return <Ionicons
              // @ts-ignore
              name={iconName}
              size={size} color={color}
            />;
          } else if (library === "FontAwesome") {
            return <FontAwesome
              // @ts-ignore
              name={iconName}
              size={size}
              color={color}
            />;
          }
        },
        tabBarActiveTintColor: Colors.tabBarActiveTint,
        tabBarInactiveTintColor: Colors.tabBarInactiveTint,
        showLabel: false,
        lazyLoad: true,
        tabBarStyle: {
          backgroundColor: Colors.tabBarBackground,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderColor: "transparent",
          position: "absolute",
          elevation: 0,
          ...styles.shadow,
        },
      })}
    >
      <Tab.Screen
        name="My Feed"
        component={FeedStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigation.navigate("My Feed", { screen: "PostFeed" });
          },
        })}
      />
      <Tab.Screen
        name="Ghillies"
        component={GhillieStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigation.navigate("Ghillies", { screen: "GhillieListing" });
          },
        })}
      />
      <Tab.Screen
        name={"Posts"}
        component={PostStackScreen}
        // Navigate to My Feed -> Create Post

        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                position: "absolute",
                bottom: 3, // space from bottombar
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../assets/icons/plus.png")}
                style={{
                  width: 40,
                  height: 40,
                  tintColor: "#f1f6f9",
                  alignContent: "center",
                }}
                alt={"plus"}
              />
            </View>
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton
              {...props}
              onPress={() =>
                navigation.navigate("Posts", { screen: "CreatePost" })
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigation.navigate("Notifications", {
              screen: "NotificationListing",
            });
          },
        })}
      />
      <Tab.Screen
        name="Account"
        component={AccountStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigation.navigate("Account", { screen: "AccountHome" });
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default ApplicationTabBar;
