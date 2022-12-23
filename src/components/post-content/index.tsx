import React from 'react';
import RegularText from '../texts/regular-texts';
import {LinkPreview} from '../link-preview';
import {colorsVerifyCode} from '../colors';
import {LinkMeta} from '../../shared/models/open-graph/link-meta';
import {Autolink} from '../autolink';
import {GhilliedUpHashTagMatcher} from '../autolink';
import {StyleProp, StyleSheet, TouchableWithoutFeedbackProps, ViewStyle} from 'react-native';
import stringUtils from "../../shared/utils/string.utils";
import {View} from "native-base";
import SmallText from "../texts/small-text";

export interface PostContentProps {
    content: string;
    linkMeta?: LinkMeta;
    metadataContainerStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    metadataTextContainerStyle?: StyleProp<ViewStyle>;
    textContainerStyle?: StyleProp<ViewStyle>;
    touchableWithoutFeedbackProps?: TouchableWithoutFeedbackProps;
    shouldTruncate?: boolean;
}

export const PostContent: React.FC<PostContentProps> = ({
                                                            content,
                                                            linkMeta,
                                                            metadataContainerStyle,
                                                            containerStyle,
                                                            metadataTextContainerStyle,
                                                            textContainerStyle,
                                                            touchableWithoutFeedbackProps,
                                                            shouldTruncate = false,
                                                        }) => {
    const _renderTruncatedPostContent = () => {
        const postString = stringUtils.trimPostString(content, 240);
        if (!postString.isTruncated) {
            return (
                <>
                    <RegularText style={{flex: 1, flexWrap: "wrap"}}>
                        {postString.text}
                    </RegularText>
                    <LinkPreview
                        linkMeta={linkMeta}
                        metadataContainerStyle={StyleSheet.flatten([
                            {
                                backgroundColor: colorsVerifyCode.primary,
                                borderRadius: 10,
                                padding: 10,
                                // Add a shadow effect
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 1,
                                    height: 1
                                }
                            },
                            metadataContainerStyle,
                        ])}
                        containerStyle={containerStyle}
                        metadataTextContainerStyle={metadataTextContainerStyle}
                        textContainerStyle={textContainerStyle}
                        touchableWithoutFeedbackProps={touchableWithoutFeedbackProps}
                    />
                </>
            )
        }

        return (
            <View>
                <RegularText style={{flex: 1, flexWrap: "wrap"}}>
                    {`${postString.text} `}
                    <SmallText style={{color: colorsVerifyCode.lighterGray, fontWeight: "bold"}}> more..</SmallText>
                </RegularText>
            </View>
        )
    }

    const _renderUnTruncatedPostContent = () => {
        return (
            <>
                <RegularText style={{flex: 1, flexWrap: "wrap"}}>
                    <Autolink
                        text={content}
                        truncate={240}
                        truncateChars="more"
                        matchers={[
                            GhilliedUpHashTagMatcher
                        ]}
                        url
                    />
                </RegularText>
                <LinkPreview
                    linkMeta={linkMeta}
                    metadataContainerStyle={StyleSheet.flatten([
                        {
                            backgroundColor: colorsVerifyCode.primary,
                            borderRadius: 10,
                            padding: 10,
                            // Add a shadow effect
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 1,
                                height: 1
                            }
                        },
                        metadataContainerStyle,
                    ])}
                    containerStyle={containerStyle}
                    metadataTextContainerStyle={metadataTextContainerStyle}
                    textContainerStyle={textContainerStyle}
                    touchableWithoutFeedbackProps={touchableWithoutFeedbackProps}
                />
            </>
        );
    }

    if (shouldTruncate && content.length > 240) {
        return _renderTruncatedPostContent();
    }

    return _renderUnTruncatedPostContent();
}
