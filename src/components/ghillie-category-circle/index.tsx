import React from "react";
import {TouchableOpacity} from "react-native";
import {Text, VStack, HStack, Avatar, Pressable} from "native-base";
import {colorsVerifyCode} from '../colors';
import {GhillieCategory} from "../../shared/models/ghillies/ghillie-category";
import {
    BASE_ICON,
    COMPANY_ICON,
    CUSTOM_ICON,
    EDUCATION_ICON,
    INDUSTRY_ICON,
    SOCIAL_ICON,
    UNIT_ICON
} from "../../assets";
import stringUtils from "../../shared/utils/string.utils";

export interface IGhillieCategoryCircle {
    onPress: (category?: GhillieCategory) => void;
    category: GhillieCategory;
    height?: number;
    width?: number;
}

export const GhillieCategoryCircle = (props: IGhillieCategoryCircle) => {
    const getCategoryIcon = () => {
        switch (props.category) {
            case GhillieCategory.BASE:
                return BASE_ICON;
            case GhillieCategory.COMPANY:
                return COMPANY_ICON;
            case GhillieCategory.CUSTOM:
                return CUSTOM_ICON;
            case GhillieCategory.EDUCATIONAL:
                return EDUCATION_ICON;
            case GhillieCategory.INDUSTRY:
                return INDUSTRY_ICON;
            case GhillieCategory.SOCIAL:
                return SOCIAL_ICON;
            case GhillieCategory.UNIT:
                return UNIT_ICON;
        }
    }

    return (
        <HStack px={{base: 3, md: 4}} justifyContent="space-evenly">
            <TouchableOpacity onPress={() => props.category ? props.onPress(props.category) : props.onPress()}>
                <VStack space={1} alignItems="center">
                    <Avatar
                        width={props.width || 20}
                        height={props.height || 20}
                        borderWidth="2"
                        borderColor={colorsVerifyCode.secondary}
                        source={
                            getCategoryIcon()
                                ? getCategoryIcon()
                                : require("../../../assets/logos/icon.png")
                        }
                    />
                    <Text
                        fontSize="xs"
                        fontWeight="normal"
                        style={{
                            color: "white",
                        }}
                    >
                        {stringUtils.enumStyleToSentence(props.category)}
                    </Text>
                </VStack>
            </TouchableOpacity>
        </HStack>
    );
};


export default GhillieCategoryCircle;
