import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, VStack, HStack, Avatar, Pressable } from "native-base";

export interface IGhillieCircle {
  onPress: () => void;
  text?: string;
  image: string;
}

export const GhillieCircle = (props: IGhillieCircle) => {
  return (
    <HStack px={{ base: 3, md: 4 }} flex={1} justifyContent="space-evenly">
      <TouchableOpacity onPress={() => props.onPress()}>
        <VStack space={1} alignItems="center">
          <Pressable>
            <Avatar
              width="20"
              height="20"
              borderWidth="2"
              source={{
                uri: props.image,
              }}
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
