import React from "react";
import {useFonts} from 'expo-font';
import {createIconSetFromFontello} from "@expo/vector-icons";

import fontelloConfig from "../../../assets/icons/config.json";

export type GhillieIconNames = "account" | "about" | "back" | "bookmarked" | "clear" | "code" | "cog" | "copy" | "ghillie" | "key" | "leave" | "lock" | "members" | "notification-check" | "pen" | "pin" | "notifications" | "plus" | "post-feed" | "posts" | "search" | "share";

interface GhillieIconProps {
    name: GhillieIconNames;
    size: number;
    color: string;
}
const GhillieIcon: React.FC<GhillieIconProps> = ({name, size, color}) => {
    const [loaded, error] = useFonts({
        "fontello": require("../../../assets/icons/fontello.ttf"),
    });

    if (!loaded) {
        return null;
    }

    const IconComponent = createIconSetFromFontello(fontelloConfig, 'fontello', 'fontello.ttf');

    return <IconComponent name={name} size={size} color={color}/>;
}

export default GhillieIcon;
