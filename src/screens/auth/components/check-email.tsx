import React from 'react';
import { Box, VStack } from 'native-base';

export default function CheckEmailIllustration() {
  return (
    <>
      <VStack
        borderWidth="1"
        rounded="md"
        py={{ base: 3, md: '18' }}
        px={5}
        _light={{ borderColor: 'coolGray.800' }}
        _dark={{ borderColor: 'coolGray.200' }}
        justifyContent="flex-start"
        width={{ base: '170', md: '270' }}
        mt={{ base: 5, md: 7 }}
        space="2"
      >
        {Array.from({ length: 2 }, () => (
          <Box
            key={Math.random()}
            _light={{ bg: 'coolGray.200' }}
            _dark={{ bg: 'coolGray.400' }}
            py={1}
            width={{ base: '130', md: '208' }}
            rounded="full"
          />
        ))}
        <Box
          key={Math.random()}
          _light={{ bg: 'coolGray.200' }}
          _dark={{ bg: 'coolGray.400' }}
          py={1}
          width={{ base: '83', md: '127' }}
          rounded="full"
        />
      </VStack>

      <VStack
        borderWidth="1"
        rounded="md"
        py={{ base: 3, md: '18' }}
        px={5}
        _light={{ borderColor: 'coolGray.800' }}
        _dark={{ borderColor: 'coolGray.200' }}
        justifyContent="flex-start"
        width={{ base: '170', md: '270' }}
        mt={{ base: 5, md: 7 }}
        space="2"
      >
        {Array.from({ length: 2 }, () => (
          <Box
            key={Math.random()}
            _light={{ bg: 'coolGray.200' }}
            _dark={{ bg: 'coolGray.400' }}
            py={1}
            width={{ base: '130', md: '208' }}
            rounded="full"
          />
        ))}
        <Box
          _light={{ bg: 'coolGray.200' }}
          _dark={{ bg: 'coolGray.400' }}
          py={1}
          width={{ base: '83', md: '127' }}
          rounded="full"
        />
      </VStack>
    </>
  );
}
