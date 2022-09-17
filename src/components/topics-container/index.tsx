import React from "react";
import {Badge, Box, HStack, Text} from "native-base";
import {TopicLiteOutputDto} from "../../shared/models/topic/topic-lite-output.dto";
import {InterfaceBoxProps} from "native-base/lib/typescript/components/primitives/Box";

export interface TopicsContainerProps {
  topics: TopicLiteOutputDto[];
}

type ContainerProps = TopicsContainerProps & InterfaceBoxProps ;

export const TopicsContainer = ({topics, ...props}: ContainerProps) => (
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
      {topics?.map((topic) => (
        <Badge
          key={topic.id}
          colorScheme="success"
          alignSelf="center"
          variant="outline"
          borderWidth={2}
        >
          <Text color={"white"}>{topic.name}</Text>
        </Badge>
      ))}
    </HStack>
  </Box>
)

export default TopicsContainer;
