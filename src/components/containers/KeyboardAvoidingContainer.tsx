import React from 'react';

import {KeyboardAvoidingView, Keyboard, ScrollView, Pressable, Platform} from 'react-native';

const KeyboardAvoidingContainer = (props: any) => {
  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'transparent'}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
    >
      <ScrollView showsVerticalScrollIndicator={false}
                  scrollEnabled={props.enableScroll !== undefined ? props.enableScroll : true}>
        <Pressable onPress={Keyboard.dismiss}>{props.children}</Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingContainer;
