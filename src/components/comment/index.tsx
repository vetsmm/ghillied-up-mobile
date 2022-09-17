import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  BottomRowWrapper,
  CommentContent,
  Container,
  Content,
  DateText,
  EditedText,
  Name,
  TopRowWrapper
} from '../style-components';
import {getTimeAgo} from "../../shared/utils/date-utils";
import {ServiceBranch} from "../../shared/models/users";
import {Icon, IconButton, Image, Text, VStack} from "native-base";
import {getMilitaryString} from "../../shared/utils/military-utils";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {CommentDetailDto} from "../../shared/models/comments/comment-detail.dto";
import {SvgXml} from "react-native-svg";
import Reactions from "../../shared/images/reactions";
import {numberToReadableFormat} from "../../shared/utils/number-utils";

export interface CommentProps {
  comment: CommentDetailDto;
  hasChildren: boolean;
  index: number;
  nested: number;
  isOp: boolean;
  onCommentReact: (commentId: string, shouldDelete: boolean) => void;
  onCommentReply: (comment: CommentDetailDto) => void;
  setOpenActionSheet: (isOpen: boolean) => void;
}

const Comment = ({
                   comment,
                   index,
                   nested,
                   hasChildren,
                   isOp = false,
                   onCommentReact,
                   onCommentReply,
                   setOpenActionSheet
                 }: CommentProps) => {

  const getServiceBranchSealPng = (serviceBranch: ServiceBranch) => {
    switch (serviceBranch) {
      case ServiceBranch.AIR_FORCE:
        return require("../../../assets/seals/png/air-force.png");
      case ServiceBranch.ARMY:
        return require("../../../assets/seals/png/army.png");
      case ServiceBranch.MARINES:
        return require("../../../assets/seals/png/usmc.png");
      case ServiceBranch.NAVY:
        return require("../../../assets/seals/png/navy.png");
      case ServiceBranch.AIR_NATIONAL_GUARD:
        return require("../../../assets/seals/png/air-national-guard.png");
      case ServiceBranch.ARMY_NATIONAL_GUARD:
        return require("../../../assets/seals/png/army-national-guard.png");
      default:
        return require("../../../assets/seals/png/us-flag.png");
    }
  }

  const _renderEmptyReaction = () => (
    <TouchableOpacity onPress={() => onCommentReact(comment.id, false)}>
      <View style={{
        paddingLeft: 8,
        width: 100,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Ionicons name="heart-outline" color="white" size={20}/>
        <Text color="white">{`  ${comment.numberOfReactions > 0
          ? `${numberToReadableFormat(comment.numberOfReactions)} Likes`
          : "Like"}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const _renderFilledReaction = () => (
    <TouchableOpacity onPress={() => onCommentReact(comment.id, true)}>
      <View style={{
        paddingLeft: 8,
        width: 100,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <SvgXml
          xml={Reactions.HEART_SVG}
          height="30"
          width="30"
        />
        <Text color="white">{`  ${comment.numberOfReactions > 0
          ? `${numberToReadableFormat(comment.numberOfReactions)} Likes`
          : "Like"}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container commentId={comment.id} nested={nested}>
      <View style={styles.rowDirection}>
        <TopRowWrapper nested={nested} hasChildren={hasChildren}>
          <View style={styles.renderTitleButton}>
            <Image
              pt={0}
              bgColor={"#266186"}
              height={30}
              mr={3}
              ml={2}
              overflow={"hidden"}
              width={30}
              source={getServiceBranchSealPng(comment.createdBy.branch)}
              alt={comment.createdBy.branch}
            />
            <VStack>
              <Text fontSize="sm" fontWeight="semibold" color={"white"}>
                {comment.createdBy.username} {isOp && (
                <Text
                  color={"#FFD700"}
                  fontSize="xs"
                >
                  (OP)
                </Text
                >)}

              </Text>
              <Name
                accessibilityHint="tap to visit user's profile screen"
                accessibilityLabel={`username ${comment.createdBy.username}`}
                name={comment.createdBy.username as string}>
                {getMilitaryString(comment.createdBy.branch, comment.createdBy.serviceStatus)}
              </Name>
            </VStack>
          </View>
          <IconButton
            variant="unstyled"
            icon={
              <Icon
                size="6"
                as={MaterialIcons}
                name={"more-vert"}
                color={"white"}
              />
            }
            onPress={() => setOpenActionSheet(true)}
          />
        </TopRowWrapper>
      </View>

      <View style={[styles.contentWrapper]}>

        <Content hasChildren={hasChildren} nested={nested}>
          <CommentContent
            accessibilityHint={`comment content ${comment.content}`}
            accessibilityLabel={`comment #${index + 1}`}
            selectable
            staff={false}>
            {comment.content}
          </CommentContent>
          <DateText
            accessibilityHint="the date and time the comment has been created"
            accessibilityLabel={`comment created at ${getTimeAgo(comment.createdDate)}`}>
            {getTimeAgo(comment.createdDate)}
          </DateText>
          {comment.edited ? (
            <EditedText
              accessibilityHint="comment has been edited by the creator"
              accessibilityLabel="edited comment">
              (edited)
            </EditedText>
          ) : null}
        </Content>

        <BottomRowWrapper>
          {comment.likedByCurrentUser ? (
            _renderFilledReaction()
          ) : (
            _renderEmptyReaction()
          )}

          {/* TODO: IMplement threaded comments */}
          {/*<TouchableOpacity onPress={() => onCommentReply(comment)}>*/}
          {/*  <View style={{*/}
          {/*    paddingLeft: 8,*/}
          {/*    flex: 1,*/}
          {/*    flexDirection: 'row',*/}
          {/*    alignItems: 'center',*/}
          {/*  }}>*/}
          {/*    <MaterialCommunityIcons name="reply" color="white" size={20}/>*/}
          {/*    <Text color="white">{` Reply`}</Text>*/}
          {/*  </View>*/}
          {/*</TouchableOpacity>*/}

        </BottomRowWrapper>

      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  closeIcon: {
    color: 'black'
  },
  contentWrapper: {
    flex: 1,
    marginTop: 0
  },
  renderTitleButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowDirection: {
    flexDirection: 'row'
  }
});

export default Comment;
