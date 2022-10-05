import React from "react";
import {TouchableOpacity} from "react-native-gesture-handler";
import {Text, VStack, HStack, Avatar, Pressable} from "native-base";

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
        <HStack px={{base: 3, md: 4}} flex={1} justifyContent="space-evenly">
            <TouchableOpacity onPress={() => props.ghillieId ? props.onPress(props.ghillieId) : props.onPress()}>
                <VStack space={1} alignItems="center">
                    <Pressable>
                        <Avatar
                            width={props.width || 20}
                            height={props.height || 20}
                            borderWidth="2"
                            source={
                                props.image
                                    ? {uri: props.image}
                                    : require("../../../assets/logos/icon.png")
                            }
                        />
                    </Pressable>
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
