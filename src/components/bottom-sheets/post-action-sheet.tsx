import React from "react";
import { Actionsheet, Divider, Icon } from "native-base";
import { colorsVerifyCode } from "../colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export interface PostActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onRemove: () => void;
  onViewGhillie: () => void;
  onEdit: () => void;
  onReport: () => void;
  isOwner?: boolean;
  isModerator?: boolean;
  isAdmin?: boolean;
}

export const PostActionSheet = ({
                                  isOpen,
                                  onClose,
                                  onDelete,
                                  onRemove,
                                  onViewGhillie,
                                  onReport,
                                  onEdit,
                                  isOwner = false,
                                  isModerator = false,
                                  isAdmin = false
                                }: PostActionSheetProps) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Actionsheet.Item
          onPress={() => onViewGhillie()}
          mr={3}
          startIcon={
            <Icon
              as={<MaterialIcons name="remove-red-eye" />}
              size={30}
            />
          }
          _text={{
            fontSize: 20
          }}
        >
          View Ghillie
        </Actionsheet.Item>
        {(isOwner) && (
          <Actionsheet.Item
            onPress={() => onEdit()}
            mr={3}
            startIcon={
              <Icon
                as={<MaterialIcons name="edit" />}
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
        <Divider borderColor="gray.300" />
        <Actionsheet.Item
          onPress={() => onReport()}
          mr={3}
          startIcon={
            <Icon
              as={<MaterialIcons name="report" />}
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
        {(isAdmin || isModerator) && (
          <Actionsheet.Item
            onPress={() => onRemove()}
            mr={3}
            startIcon={
              <Icon
                as={<Ionicons name="eye-off" />}
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
                as={<Ionicons name="trash" />}
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
