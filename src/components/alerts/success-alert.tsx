import React from "react";
import {Alert, Box, Center, VStack, Text} from "native-base";

export const SuccessAlert = ({ title, body, autoHide = true, timeout = 3000 }) => {
  return (
    <Center>
      <VStack space={5} maxW="400">
        <Alert w="100%" status="success">
          <VStack space={1} flexShrink={1} w="100%" alignItems="center">
            <Alert.Icon size="md" />
            <Text fontSize="md" fontWeight="medium" _dark={{
              color: "coolGray.800"
            }}>
              {title}
            </Text>

            <Box _text={{
              textAlign: "center"
            }} _dark={{
              _text: {
                color: "coolGray.600"
              }
            }}>
              {body}
            </Box>
          </VStack>
        </Alert>
      </VStack>
    </Center>
  )
}
