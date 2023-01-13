import React from "react";
import {Actionsheet, Divider, Icon} from "native-base";
import {colorsVerifyCode} from "../colors";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";

export interface PostActionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    onRemove: () => void;
    onViewGhillie: () => void;
    onEdit: () => void;
    onReport: () => void;
    onBookmark: () => void;
    isOwner?: boolean;
    isModerator?: boolean;
    isAdmin?: boolean;
    isGhillieMember: boolean;
    onShare: () => void;
    isPinned: boolean;
    isPinnable?: boolean;
    onPinPost: () => void;
    onUnpinPost: () => void;
}

export const PostActionSheet = ({
                                    isOpen,
                                    onClose,
                                    onDelete,
                                    onRemove,
                                    onViewGhillie,
                                    onReport,
                                    onEdit,
                                    onBookmark,
                                    onShare,
                                    onPinPost,
                                    onUnpinPost,
                                    isPinnable = false,
                                    isPinned = false,
                                    isOwner = false,
                                    isModerator = false,
                                    isAdmin = false,
                                    isGhillieMember = false,
                                }: PostActionSheetProps) => {

    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
                {isGhillieMember && (
                    <>
                        <Actionsheet.Item
                            onPress={() => onViewGhillie()}
                            mr={3}
                            startIcon={
                                <Icon
                                    as={<MaterialIcons name="remove-red-eye"/>}
                                    size={30}
                                />
                            }
                            _text={{
                                fontSize: 20
                            }}
                        >
                            View Ghillie
                        </Actionsheet.Item>
                        <Actionsheet.Item
                            onPress={() => onBookmark()}
                            mr={3}
                            startIcon={
                                <Icon
                                    as={<MaterialIcons name="bookmark"/>}
                                    size={30}
                                />
                            }
                            _text={{
                                fontSize: 20
                            }}
                        >
                            Bookmark Post
                        </Actionsheet.Item>
                        <Actionsheet.Item
                            onPress={() => onShare()}
                            mr={3}
                            startIcon={
                                <Icon
                                    as={<Ionicons name="share-social"/>}
                                    size={30}
                                />
                            }
                            _text={{
                                fontSize: 20
                            }}
                        >
                            Share
                        </Actionsheet.Item>
                        {(isPinnable && (isAdmin || isModerator)) && (
                            <Actionsheet.Item
                                onPress={() => {
                                    if (isPinned) {
                                        onUnpinPost();
                                    } else {
                                        onPinPost();
                                    }
                                }}
                                mr={3}
                                startIcon={
                                    <Icon
                                        as={<Ionicons name="pin"/>}
                                        size={30}
                                    />
                                }
                                _text={{
                                    fontSize: 20
                                }}
                            >
                                {isPinned ? "Unpin from Ghillie" : "Pin to Ghillie"}
                            </Actionsheet.Item>
                        )}
                        <Divider borderColor="gray.300"/>
                    </>
                )}
                {(isOwner) && (
                    <Actionsheet.Item
                        onPress={() => onEdit()}
                        mr={3}
                        startIcon={
                            <Icon
                                as={<MaterialIcons name="edit"/>}
                                size={30}
                            />
                        }
                        _text={{
                            fontSize: 20
                        }}
                    >
                        Edit Post
                    </Actionsheet.Item>
                )}
                {isGhillieMember || isAdmin && (
                    <Actionsheet.Item
                        onPress={() => onReport()}
                        mr={3}
                        startIcon={
                            <Icon
                                as={<MaterialIcons name="report"/>}
                                size={30}
                                color={colorsVerifyCode.fail}
                            />
                        }
                        _text={{
                            color: colorsVerifyCode.fail,
                            fontSize: 20
                        }}
                    >
                        Report
                    </Actionsheet.Item>
                )}
                {(isAdmin || isModerator) && (
                    <Actionsheet.Item
                        onPress={() => onRemove()}
                        mr={3}
                        startIcon={
                            <Icon
                                as={<Ionicons name="eye-off"/>}
                                size={30}
                                color={colorsVerifyCode.fail}
                            />
                        }
                        _text={{
                            color: colorsVerifyCode.fail,
                            fontSize: 20
                        }}
                    >
                        Remove Post
                    </Actionsheet.Item>
                )}
                {(isAdmin || isOwner) && (
                    <Actionsheet.Item
                        onPress={() => onDelete()}
                        mr={3}
                        startIcon={
                            <Icon
                                as={<Ionicons name="trash"/>}
                                size={30}
                                color={colorsVerifyCode.fail}
                            />
                        }
                        _text={{
                            color: colorsVerifyCode.fail,
                            fontSize: 20
                        }}
                    >
                        Delete Post
                    </Actionsheet.Item>
                )}
            </Actionsheet.Content>
        </Actionsheet>
    );
};

export default PostActionSheet;
