import React from "react";
import {Spinner} from "native-base";
import {colorsVerifyCode} from "../colors";
import StyledSelect from "../select/styled-select";
import stringUtils from "../../shared/utils/string.utils";
import StyledTextFieldInput from "../inputs/styled-text-field-input";
import {FlagCategory} from "../../shared/models/flags/flag-category";
import {Modal} from 'react-native';
import BigText from '../texts/big-text';
import RegularButton from '../buttons/regular-button';
import {ButtonRow, ModalPressableContainer, ModalView} from '../modals/ok-cancel-modal';

const {tertiary} = colorsVerifyCode;


export interface ReportMenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (category: FlagCategory, details: string) => void;
  cancelRef: React.RefObject<any>;
  title?: string;
  isLoading?: boolean;
}

// TODO: Change to a styled modal
export const ReportMenuDialog: React.FC<ReportMenuDialogProps> = ({isOpen, onClose, onReport, isLoading, title = "Report Post"}) => {
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
    <Modal animationType="slide" visible={isOpen} transparent={true}>
      <ModalPressableContainer>
        <ModalView>
          <BigText style={{fontSize: 25, color: tertiary, marginVertical: 10}}>{title}</BigText>

          <StyledSelect
            containerStyle={{
              width: "100%",
            }}
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
            containerStyle={{
              width: "100%",
            }}
            label="Description of Report"
            style={{
              width: "100%",
            }}
            value={details}
            onChangeText={(value) => setState(prevState => ({
              ...prevState,
              details: value,
            }))}
            accessibilityLabel="Report Description"
          />

          {isLoading ? (
            <Spinner color={tertiary}/>
          ): (
            <ButtonRow>
              <RegularButton
                onPress={() => onClose()}
                style={{
                  backgroundColor: colorsVerifyCode.fail,
                  width: '50%',
                }}
                textStyle={{
                  color: colorsVerifyCode.white,
                }}
              >
                Cancel
              </RegularButton>
              <RegularButton
                  onPress={() => submitReport()}
                  style={{
                    width: '50%',
                    marginRight: 10
                  }}
              >
                Submit Report
              </RegularButton>
            </ButtonRow>
          )}
        </ModalView>
      </ModalPressableContainer>
    </Modal>
  );
}
