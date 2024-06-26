import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {SharedElement} from 'react-navigation-shared-element';
import styles from './styles';
import {GhillieDetailDto} from "../../../shared/models/ghillies/ghillie-detail.dto";
import {numberToReadableFormat} from "../../../shared/utils/number-utils";
import {colorsVerifyCode} from '../../colors';
import {View} from 'native-base';


export const GhillieCard: React.FC<{
  ghillie: GhillieDetailDto;
  index: number;
}> = ({ghillie, index}) => {
  const navigation: any = useNavigation();
  const handleNavigate = useCallback(() => {
    navigation.navigate('GhillieDetail', {ghillieId: ghillie.id, ghillieIndex: index});
  }, [index, navigation, ghillie]);
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={handleNavigate}>
      <SharedElement
        style={styles.imageContainer}
        id={`ghillie#${index}-Image`}>
        <Image
            source={
                ghillie?.imageUrl
                    ? {uri: ghillie?.imageUrl}
                    : require("../../../../assets/logos/icon.png")
            }
          resizeMode={'center'}
          style={styles.image}
        />
      </SharedElement>
      <View style={styles.titleContainer}>
        <Text style={styles.text}>{ghillie?.name}</Text>
        <Text style={styles.timestamp}>
          {ghillie?.totalMembers ? `${numberToReadableFormat(ghillie?.totalMembers)} Members` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
