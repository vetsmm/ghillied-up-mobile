import React from 'react';
import { StyleSheet, StyleProp, View } from 'react-native';
import {ResizeMode, Video} from 'expo-av'

export interface VideoProps {
  source: string;
  style?: StyleProp<any>;
}

export const VideoPlayer: React.FC<VideoProps> = ({source, style}) => {
  const video = React.useRef<any>(null);
  
  return (
    <View style={styles.container}>
    <Video
        style={style}
        ref={video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        source={{
          uri: source
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
