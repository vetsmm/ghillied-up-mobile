import React from "react";
import {TouchableOpacity} from "react-native";
import {Text, VStack, HStack, Avatar} from "native-base";
import {colorsVerifyCode} from '../colors';

export interface IGhillieCircle {
    onPress: (ghillieId?: string) => void;
    text?: string;
    image: string | undefined | null;
    ghillieId?: string;
    height?: number;
    width?: number;
}

export const GhillieCircle = (props: IGhillieCircle) => {
    return (
        <HStack px={{base: 3, md: 4}} justifyContent="space-evenly">
            <TouchableOpacity
                onPress={() => props.ghillieId ? props.onPress(props.ghillieId) : props.onPress()}
            >
                <VStack space={1} alignItems="center">
                    <Avatar
                        width={props.width || 20}
                        height={props.height || 20}
                        borderWidth="2"
                        borderColor={colorsVerifyCode.secondary}
                        source={
                            props.image
                                ? {uri: props.image}
                                : require("../../../assets/logos/icon.png")
                        }
                    />
                    {props.text && (
                        <Text
                            fontSize="xs"
                            fontWeight="normal"
                            style={{
                                color: "white",
                            }}
                        >
                            {props.text}
                        </Text>
                    )}
                </VStack>
            </TouchableOpacity>
        </HStack>
    );
};
