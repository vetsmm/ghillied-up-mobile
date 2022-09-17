import React from "react";
import {Badge, Box, HStack, VStack, Text} from "native-base";
import {TopicLiteOutputDto} from "../../shared/models/topic/topic-lite-output.dto";
import {InterfaceBoxProps} from "native-base/lib/typescript/components/primitives/Box";

export interface TagsContainerProps {
  tags: TopicLiteOutputDto[];
}

type ContainerProps = TagsContainerProps & InterfaceBoxProps ;

export const TagsContainer = ({tags, ...props}: ContainerProps) => (
  <Box {...props}>
    <Text style={{
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 30,
      paddingHorizontal: 24,
      marginVertical: 18,
      color: 'white',
    }}>
      Topics
    </Text>

    <HStack
      space={4}
      marginBottom={5}
      mx={{
      base: "auto",
      md: "0",
    }}>
      <VStack space={4}>
        {tags?.map((tag) => (
          <Badge
            key={tag.id}
            colorScheme="success"
            alignSelf="center"
            variant="outline"
            borderWidth={2}
          >
            <Text color={"white"}>{tag.name}</Text>
          </Badge>
        ))}
      </VStack>
    </HStack>
  </Box>
)

export default TagsContainer;
