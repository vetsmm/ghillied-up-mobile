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
} from '../style-components';
import {getTimeAgo} from "../../shared/utils/date-utils";
import {ServiceBranch} from "../../shared/models/users";
import {Icon, IconButton, Image, Spinner, Text, VStack} from "native-base";
import {getMilitaryString} from "../../shared/utils/military-utils";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {SvgXml} from "react-native-svg";
import Reactions from "../../shared/images/reactions";
import {numberToReadableFormat} from "../../shared/utils/number-utils";
import {ParentCommentDto} from '../../shared/models/comments/parent-comment.dto';

export interface ParentCommentProps {
    comment: ParentCommentDto;
    hasChildren: boolean;
    index: number;
    isOp: boolean;
    onCommentReact: (commentId: string, shouldDelete: boolean) => void;
    onCommentReply: (comment: ParentCommentDto) => void;
    setOpenActionSheet: (isOpen: boolean) => void;
    reactionLoading?: boolean;
}

const ParentComment = ({
                           comment,
                           index,
                           hasChildren,
                           isOp = false,
                           onCommentReact,
                           onCommentReply,
                           setOpenActionSheet,
                           reactionLoading = false
                       }: ParentCommentProps) => {

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
            case ServiceBranch.COAST_GUARD:
                return require("../../../assets/seals/png/coast-guard.png");
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
                alignItems: 'center'
            }}>
                <Ionicons name="heart-outline" color="white" size={20}/>
                <Text color="white">{`  ${comment?.numberOfReactions > 0
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
                alignItems: 'center'
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
        <Container commentId={comment.id} nested={1}>
            <View style={styles.rowDirection}>
                <View style={styles.renderTitleButton}>
                    <Image
                        pt={0}
                        bgColor={"#266186"}
                        height={30}
                        mr={3}
                        overflow={"hidden"}
                        width={30}
                        source={getServiceBranchSealPng(comment.createdBy.branch)}
                        alt={comment.createdBy.branch}
                    />
                    <VStack>
                        <Name
                            accessibilityHint="tap to visit user's profile screen"
                            accessibilityLabel={`username ${comment.createdBy.username}`}
                            name={comment.createdBy.username as string}>
                            {getMilitaryString(comment.createdBy.branch, comment.createdBy.serviceStatus)}
                            {" "}
                            {isOp && (
                                <Text
                                    color={"#FFD700"}
                                    fontSize="xs"
                                >
                                    (OP)
                                </Text
                                >)}
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
            </View>

            <View style={[styles.contentWrapper]}>
                <Content hasChildren={hasChildren} nested={1}>
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
                    {reactionLoading ? (
                        <Spinner color="white" size="sm"/>
                    ) : (
                        <>
                            {comment.currentUserReaction ? (
                                _renderFilledReaction()
                            ) : (
                                _renderEmptyReaction()
                            )}
                        </>
                    )}

                    <TouchableOpacity onPress={() => onCommentReply(comment)}>
                        <View style={{
                            paddingLeft: 8,
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <MaterialCommunityIcons name="reply" color="white" size={20}/>
                            <Text color="white">{` Reply`}</Text>
                        </View>
                    </TouchableOpacity>

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
        flexDirection: 'row',
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "5%",
        marginLeft: 0,
    }
});

export default ParentComment;
