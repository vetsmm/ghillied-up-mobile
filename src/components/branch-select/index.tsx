import React from "react";
import {CheckIcon, FormControl, Select, WarningOutlineIcon} from "native-base";
import {ServiceBranch, stringToServiceBranch} from "../../shared/models/users";
import stringUtils from "../../shared/utils/string.utils";

interface BranchSelectProps {
  onSelect: (branch: ServiceBranch) => void;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage: string | null;
}

const BranchSelect = ({onSelect, isRequired, isInvalid, errorMessage}: BranchSelectProps) => {

  const buildBranchOptions = (): Array<React.ReactNode> => {
    const branchOptions = [] as Array<React.ReactNode>;

    // Iterate over ServiceBranch enum and build options
    Object.keys(ServiceBranch).forEach((key) => {
      if (key !== "UNKNOWN" && key !== "NO_SERVICE") {
        branchOptions.push(
          <Select.Item
            key={key}
            value={stringToServiceBranch(key)}
            label={stringUtils.enumStyleToSentence(key)}
          />
        );
      }
    });

    return branchOptions;
  }

  return (
    <>
      <FormControl isRequired={isRequired} isInvalid={isInvalid}>
        <Select
          accessibilityLabel="Choose Service"
          placeholder="Choose Service"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size={5}/>
          }}
          mt="1"
          onValueChange={(value) => onSelect(stringToServiceBranch(value))}
        >
          {buildBranchOptions()}
        </Select>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
          {errorMessage && errorMessage}
        </FormControl.ErrorMessage>
      </FormControl>
    </>
  );
};

export default BranchSelect;

