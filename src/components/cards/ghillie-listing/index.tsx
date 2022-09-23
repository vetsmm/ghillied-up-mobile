import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {SharedElement} from 'react-navigation-shared-element';
import styles from './styles';
import {GhillieDetailDto} from "../../../shared/models/ghillies/ghillie-detail.dto";
import {numberToReadableFormat} from "../../../shared/utils/number-utils";


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
          source={{
            uri:
              ghillie?.imageUrl
                ? ghillie?.imageUrl
                : `https://picsum.photos/${Math.floor(Math.random() * 1000)}`,
            cache: 'force-cache',
          }}
          resizeMode={'cover'}
          style={styles.image}
        />
      </SharedElement>
      <LinearGradient
        colors={['#0000', '#000A', '#000']}
        style={styles.titleContainer}>
        <Text style={styles.text}>{ghillie?.name}</Text>
        <Text style={styles.timestamp}>
          {ghillie?.totalMembers ? `${numberToReadableFormat(ghillie?.totalMembers)} Members` : ''}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
