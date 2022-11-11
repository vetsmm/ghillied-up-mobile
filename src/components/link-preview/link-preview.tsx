import * as React from 'react'
import {
  Image,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle
} from 'react-native'

import {LinkMeta} from '../../shared/models/open-graph/link-meta';
import {colorsVerifyCode} from '../colors';
import * as WebBrowser from 'expo-web-browser';
import {getImageSize} from './utils';
import {useEffect} from 'react';
import {VideoPlayer} from '../video-player';

export interface LinkPreviewProps {
  containerStyle?: StyleProp<ViewStyle>
  header?: string
  metadataContainerStyle?: StyleProp<ViewStyle>
  metadataTextContainerStyle?: StyleProp<ViewStyle>
  linkMeta?: LinkMeta
  textContainerStyle?: StyleProp<ViewStyle>
  touchableWithoutFeedbackProps?: TouchableWithoutFeedbackProps
}

export const LinkPreview = React.memo(
  ({
     containerStyle,
     header,
     metadataContainerStyle,
     metadataTextContainerStyle,
     linkMeta,
     textContainerStyle,
     touchableWithoutFeedbackProps
   }: LinkPreviewProps) => {
    const [containerWidth, setContainerWidth] = React.useState(0)
    
    const [aspectRatio, setAspectRatio] = React.useState<number | undefined>(undefined)
    
    useEffect(() => {
      if (linkMeta?.image) {
        getImageSize(linkMeta.image).then((size) => {
          setAspectRatio(size.width / size.height)
        })
      }
    }, [linkMeta])
    
    // React.useEffect(() => {
    //   let isCancelled = false
    //   if (previewData) {
    //     setData(previewData)
    //     return
    //   }
    //
    //   const fetchData = async () => {
    //     setData(undefined)
    //     const newData = await getPreviewData(text,  linkMeta)
    //     // Set data only if component is still mounted
    //     /* istanbul ignore next */
    //     if (!isCancelled) {
    //       // No need to cover LayoutAnimation
    //       /* istanbul ignore next */
    //       if (enableAnimation) {
    //         LayoutAnimation.easeInEaseOut()
    //       }
    //       setData(newData)
    //       onPreviewDataFetched?.(newData)
    //     }
    //   }
    //
    //   fetchData()
    //   return () => {
    //     isCancelled = true
    //   }
    // }, [
    //   enableAnimation,
    //   onPreviewDataFetched,
    //   previewData,
    //   requestTimeout,
    //   text
    // ])
    
    const handleContainerLayout = React.useCallback(
      (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width)
      },
      []
    )
    
    const handlePress = () => linkMeta?.url && WebBrowser.openBrowserAsync(linkMeta.url)
    
    const renderDescriptionNode = (description: string) => {
      return (
        <Text numberOfLines={3} style={styles.description}>
          {description}
        </Text>
      )
    }
    
    const renderHeaderNode = () => {
      return (
        <Text numberOfLines={1} style={styles.header}>
          {header}
        </Text>
      )
    }
    
    const renderImageNode = (image: string) => {
      // aspectRatio shouldn't be undefined, just an additional check
      /* istanbul ignore next */
      const ar = aspectRatio ?? 1
      
      return <Image
        accessibilityRole="image"
        resizeMode="contain"
        source={{uri: image}}
        style={StyleSheet.flatten([
          styles.image,
          ar < 1
            ? {
              height: containerWidth,
              minWidth: 170,
              width: containerWidth * ar
            }
            : {
              height: containerWidth / ar,
              maxHeight: containerWidth,
              width: containerWidth
            }
        ])}
      />
    }
    
    const renderLinkPreviewNode = () => {
      return <>
        <View
          style={StyleSheet.flatten([
            textContainerStyle
          ])}
        >
          {renderHeaderNode()}
          {(linkMeta?.description ||
            (linkMeta?.image &&
              aspectRatio === 1 &&
              (linkMeta?.description || linkMeta?.title)) ||
            linkMeta?.title) && (
            <TouchableWithoutFeedback
              accessibilityRole="button"
              onPress={handlePress}
              {...touchableWithoutFeedbackProps}
            >
              <View
                style={StyleSheet.flatten([
                  styles.metadataContainer,
                  metadataContainerStyle
                ])}
              >
                <View
                  style={StyleSheet.flatten([
                    styles.metadataTextContainer,
                    metadataTextContainerStyle
                  ])}
                >
                  {linkMeta?.title && renderTitleNode(linkMeta.title)}
                  {linkMeta?.description && renderDescriptionNode(linkMeta.description)}
                </View>
                {linkMeta?.image &&
                  aspectRatio === 1 &&
                  renderMinimizedImageNode(linkMeta.image)}
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
        {/* Render image node only if there is an image with an aspect ratio not equal to 1
              OR there are no description and title
            */}
        {linkMeta?.video && (
          renderVideoNode(linkMeta.video)
        )}
        {(!linkMeta?.video && (linkMeta?.image)) &&
          (aspectRatio !== 1 || (!linkMeta?.description && !linkMeta.title)) &&
          (
            <TouchableWithoutFeedback
              accessibilityRole="button"
              onPress={handlePress}
              {...touchableWithoutFeedbackProps}
            >
              {renderImageNode(linkMeta.image)}
            </TouchableWithoutFeedback>
          )}
      </>
    }
    
    const renderVideoNode = (video: string) => {
      return (
        <VideoPlayer
          source={video}
          style={{
            alignSelf: 'center',
            width: 320,
            height: 200,
          }}
        />
      )
    }
    
    const renderMinimizedImageNode = (image: string) => {
      return <Image
        accessibilityRole="image"
        source={{uri: image}}
        style={styles.minimizedImage}
      />
    }
    
    const renderTitleNode = (title: string) => {
      return <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
    }
    
    return (
      <View onLayout={handleContainerLayout} style={containerStyle}>
        {renderLinkPreviewNode()}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  description: {
    color: colorsVerifyCode.white,
    marginTop: 4
  },
  header: {
    marginBottom: 6
  },
  image: {
    alignSelf: 'center',
    backgroundColor: colorsVerifyCode.primary
  },
  metadataContainer: {
    flexDirection: 'row',
    marginTop: 16,
    backgroundColor: colorsVerifyCode.primary
  },
  metadataTextContainer: {
    flex: 1
  },
  minimizedImage: {
    borderRadius: 12,
    height: 48,
    marginLeft: 4,
    width: 48
  },
  
  title: {
    color: colorsVerifyCode.white,
    fontWeight: 'bold'
  },
  text: {
    color: colorsVerifyCode.white
  }
})
