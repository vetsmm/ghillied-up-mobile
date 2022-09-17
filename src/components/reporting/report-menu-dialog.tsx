import React from "react";
import {AlertDialog, Button} from "native-base";
import {colorsVerifyCode} from "../colors";
import StyledSelect from "../select/styled-select";
import stringUtils from "../../shared/utils/string.utils";
import StyledTextFieldInput from "../inputs/styled-text-field-input";
import {FlagCategory} from "../../shared/models/flags/flag-category";

export interface ReportMenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (category: FlagCategory, details: string) => void;
  cancelRef: React.RefObject<any>;
  title?: string;
}
export const ReportMenuDialog = ({isOpen, onClose, cancelRef, onReport, title = "Report Post"}: ReportMenuDialogProps) => {
  const [{
    category,
    details,
  }, setState] = React.useState({
    category: FlagCategory.HARRASSMENT,
    details: "",
  });

  const submitReport = () => {
    onReport(category, details);
    onClose();
  }

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialog.Content
        rounded={20}
        borderWidth={3}
        borderColor={colorsVerifyCode.accent}
      >
        <AlertDialog.CloseButton _icon={{
          color: colorsVerifyCode.white
        }}/>
        <AlertDialog.Header
          backgroundColor={colorsVerifyCode.dialogPrimary}
          _text={{
            color: 'white'
          }}
        >
          {title}
        </AlertDialog.Header>
        <AlertDialog.Body
          backgroundColor={colorsVerifyCode.dialogPrimary}
          _text={{
            color: 'white'
          }}
        >
          <StyledSelect
            onSelect={(value) => {
              setState(prevState => ({
                ...prevState,
                // map value to enum,
                category: stringUtils.mapStringToObjectKey(value, FlagCategory),
              }));
            }}
            options={Object.values(FlagCategory).map(value => ({
              label: stringUtils.enumStyleToSentence(value),
              value,
            }))}
            placeholder="Select a category"
            accessibilityLabel="Report Category"
            label="Report Category"
            isError={false}
          />
          <StyledTextFieldInput
            label="Description of Report"
            value={details}
            onChangeText={(value) => setState(prevState => ({
              ...prevState,
              details: value,
            }))}
            accessibilityLabel="Report Description"
          />
        </AlertDialog.Body>
        <AlertDialog.Footer
          backgroundColor={colorsVerifyCode.dialogPrimary}
        >
          <Button.Group space={2}>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={onClose}
              ref={cancelRef}
              _text={{
                color: 'white'
              }}
            >
              Cancel
            </Button>
            <Button colorScheme="danger" onPress={submitReport}>
              Report
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
