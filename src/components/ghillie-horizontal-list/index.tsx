import React from "react";
import {Center, Text, View} from "native-base";
import {GhillieDetailDto} from "../../shared/models/ghillies/ghillie-detail.dto";
import {FlashList} from '@shopify/flash-list';
import GhillieCardV2 from '../ghillie-card-v2';
import {Colors} from '../../shared/styles';

export const GhillieHorizontalList = ({
                                        ghillieList,
                                        isLoadingGhillies,
                                        onJoinPress
                                      }: {
  ghillieList: GhillieDetailDto[];
  isLoadingGhillies: boolean;
  onJoinPress: (ghillie: GhillieDetailDto) => void;
}) => {
  return (
    <FlashList
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      data={ghillieList}
      estimatedItemSize={400}
      renderItem={({item}: any) => (
        <View key={item.id} mr={2}>
          <GhillieCardV2
            ghillie={item}
            onJoinPress={onJoinPress}
          />
        </View>
      )}
      refreshing={isLoadingGhillies}
      ListEmptyComponent={
        <Center>
          <Text style={{
            color: Colors.secondary
          }}>No Ghillies Found</Text>
        </Center>
      }
    />
  )
}

export default GhillieHorizontalList;
