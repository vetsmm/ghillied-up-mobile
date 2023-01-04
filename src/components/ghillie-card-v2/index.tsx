import React, {useCallback} from 'react';
import {GhillieDetailDto} from '../../shared/models/ghillies/ghillie-detail.dto';
import {TouchableOpacity} from 'react-native';
import {AspectRatio, Box, Image, Center, Heading, HStack, Stack, Text, Button} from 'native-base';
import {numberToReadableFormat} from '../../shared/utils/number-utils';
import {colorsVerifyCode} from '../colors';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import stringUtils from '../../shared/utils/string.utils';

interface GhillieCardV2Props {
  ghillie: GhillieDetailDto;
  onJoinPress: (ghillie: GhillieDetailDto) => void;
  isVerifiedMilitary: boolean;
  isMember?: boolean;
}

export const GhillieCardV2: React.FC<GhillieCardV2Props> = ({ghillie, onJoinPress, isVerifiedMilitary, isMember= false}) => {

  const navigation: any = useNavigation();

  const handleNavigate = useCallback(() => {
    navigation.navigate('GhillieDetail', {ghillieId: ghillie.id});
  }, [navigation, ghillie]);

  const _previewButton = () => (
      <Button
          size="sm"
          style={{
            backgroundColor: "transparent",
            borderRadius: 15,
            borderColor: colorsVerifyCode.secondary,
            borderWidth: 1,
            width: isVerifiedMilitary ? "45%" : "90%",
            marginRight: 2
          }}
          onPress={() => handleNavigate()}
      >
        Preview
      </Button>
  );

    const _joinButton = () => (
        <Button
            size="sm"
            style={{
              backgroundColor: colorsVerifyCode.accent,
              borderRadius: 15,
              width: "45%",
              marginLeft: 2
            }}
            onPress={() => onJoinPress(ghillie)}
        >
          Join
        </Button>
    );

    const _viewButton = () => (
        <Button
            size="sm"
            style={{
              backgroundColor: "transparent",
              borderRadius: 15,
              borderColor: colorsVerifyCode.secondary,
              borderWidth: 1,
              width: "90%",
              marginRight: 2
            }}
            onPress={() => handleNavigate()}
        >
          View
        </Button>
    );

  const _renderButtonView = () => {
    if (isMember) {
      return _viewButton();
    }
    if (isVerifiedMilitary) {
      return (
          <>
            {_previewButton()}
            {_joinButton()}
          </>
      )
    }

    return _previewButton();
  }

  return (
    <TouchableOpacity onPress={() => handleNavigate()}>
      <Box alignItems="center">
        <Box
          maxW="80"
          rounded="2xl"
          overflow="hidden"
          borderColor={colorsVerifyCode.secondary}
          borderWidth="1"
          style={{
            backgroundColor: colorsVerifyCode.primary
          }}
        >
          <Box>
            <AspectRatio w="100%" ratio={8 / 3}>
              <Image
                source={
                  ghillie?.imageUrl
                    ? {uri: ghillie?.imageUrl}
                    : require("../../../assets/logos/logo-square.png")
                }
                alt={`${ghillie?.name} logo`}
              />
            </AspectRatio>
          </Box>
          <Stack p="4" space={3}>
            <Stack space={2}>
              <Heading
                size="sm"
                ml="-1"
                color={colorsVerifyCode.white}
                alignSelf={"center"}
              >
                {ghillie.name}
              </Heading>
              <HStack justifyContent="center">
                <Ionicons name="person" size={11} color={colorsVerifyCode.secondary} />
                <Text
                  fontSize="xs"
                  color={colorsVerifyCode.secondary}
                  fontWeight="500"
                  ml="1"
                  mt="-1"
                  alignSelf={"center"}
                >
                  {ghillie?.totalMembers ? `${numberToReadableFormat(ghillie?.totalMembers)} Members` : ''}
                </Text>
              </HStack>
            </Stack>
            <Text
              fontSize="xs"
              fontWeight="400"
              height={10}
              color={colorsVerifyCode.white}
              alignSelf={"center"}
            >
              {stringUtils.trimString(ghillie.about, 80)}
            </Text>
            <HStack alignItems="center" space={4} justifyContent="center">
              <HStack alignItems="center" justifyContent="center">
                {_renderButtonView()}
              </HStack>
            </HStack>
          </Stack>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}

export default GhillieCardV2;
