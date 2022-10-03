import React from "react";

import {Popover, Text, useDisclose, View} from "native-base";
import {Ionicons} from "@expo/vector-icons";
import {TouchableOpacity} from "react-native";
import {SvgXml} from "react-native-svg";
import Reactions from "../../shared/images/reactions";
import {colorsVerifyCode} from "../colors";
import {ReactionType} from "../../shared/models/reactions/reaction-type";

export interface ReactionButtonProps {
  onReact: (reaction: ReactionType) => void;
  onUnReact: () => void;
  currentReaction: ReactionType | null;
}

const PressableIcon = ({onPress, reaction}) => {

  return (
    <TouchableOpacity onPress={onPress} style={{marginRight: 2}}>
      <SvgXml
        xml={reaction}
        height="30"
        width="30"
      />
    </TouchableOpacity>
  )
}

export const ReactionButton = (props: ReactionButtonProps) => {

  const {isOpen, onClose, onOpen} = useDisclose()

  const getReactionText = (reaction: ReactionType | null) => {
    switch (reaction) {
      case ReactionType.THUMBS_UP:
        return "Liked";
      case ReactionType.ANGRY:
        return "Angry";
      case ReactionType.CURIOUS:
        return "Curious";
      case ReactionType.SMART:
        return "Smart";
      case ReactionType.LAUGH:
        return "Funny";
      default:
        return "Liked";
    }
  }
  const getReactionPath = (inReaction: ReactionType | null): string => {
    switch (inReaction) {
      case ReactionType.THUMBS_UP:
        return Reactions.HEART_SVG;
      case ReactionType.ANGRY:
        return Reactions.ANGRY_SVG;
      case ReactionType.CURIOUS:
        return Reactions.CURIOUS_SVG;
      case ReactionType.SMART:
        return Reactions.SMART_SVG;
      case ReactionType.LAUGH:
        return Reactions.LAUGH_SVG;
      default:
        return Reactions.HEART_SVG;
    }
  }

  const _trigger = (triggerProps) => (
    <TouchableOpacity
      {...triggerProps}
      onPress={() => {
        props.onReact(ReactionType.THUMBS_UP);
      }}
      onLongPress={onOpen}
    >
      <View style={{
        paddingLeft: 8,
        width: 100,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}>
        <Ionicons name="heart-outline" color="white" size={30}/>
        <Text color="white">{` Like`}</Text>
      </View>
    </TouchableOpacity>
  );

  const _triggerExistingReaction = (triggerProps) => (
    <TouchableOpacity
      {...triggerProps}
      onPress={() => props.onUnReact()}
      onLongPress={onOpen}
    >
      <View style={{
        paddingLeft: 8,
        width: 100,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}>
        <SvgXml
          xml={getReactionPath(props.currentReaction)}
          height="30"
          width="30"
        />
        <Text color="white">{`  ${getReactionText(props.currentReaction)}`}</Text>
      </View>
    </TouchableOpacity>
  );

  const onPress = (reaction: ReactionType) => {
    props.onReact(reaction);
    onClose();
  }

  return (
    <Popover
      trigger={props.currentReaction === null ? _trigger : _triggerExistingReaction}
      placement="top"
      isOpen={isOpen}
      isKeyboardDismissable={true}
      onClose={onClose}
    >
      <Popover.Content>
        <Popover.Arrow/>
        <Popover.Body
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            paddingVertical: 8,
            backgroundColor: colorsVerifyCode.secondary
          }}
        >
          <PressableIcon
            reaction={getReactionPath(ReactionType.THUMBS_UP)}
            onPress={() => onPress(ReactionType.THUMBS_UP)}
          />
          <PressableIcon
            reaction={getReactionPath(ReactionType.LAUGH)}
            onPress={() => onPress(ReactionType.LAUGH)}
          />
          <PressableIcon
            reaction={getReactionPath(ReactionType.SMART)}
            onPress={() => onPress(ReactionType.SMART)}
          />
          <PressableIcon
            reaction={getReactionPath(ReactionType.CURIOUS)}
            onPress={() => onPress(ReactionType.CURIOUS)}
          />
          <PressableIcon
            reaction={getReactionPath(ReactionType.ANGRY)}
            onPress={() => onPress(ReactionType.ANGRY)}
          />
        </Popover.Body>
      </Popover.Content>
    </Popover>
  )
}

export default ReactionButton;
