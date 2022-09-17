import React from "react";
import {CheckIcon, FormControl, Select, WarningOutlineIcon} from "native-base";
import stringUtils from "../../shared/utils/string.utils";
import {ServiceStatus, stringToServiceStatus} from "../../shared/models/users";

interface ServiceStatusSelectProps {
  onSelect: (serviceStatus: ServiceStatus) => void;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage: string | null;
}
const ServiceStatusSelect = ({onSelect, isRequired, isInvalid, errorMessage}: ServiceStatusSelectProps) => {

  const buildServiceStatusOptions = (): Array<React.ReactNode> => {
    const branchOptions = [] as Array<React.ReactNode>;

    // Iterate over ServiceBranch enum and build options
    Object.keys(ServiceStatus).forEach((key) => {
      if (key !== "UNKNOWN") {
        branchOptions.push(
          <Select.Item
            key={key}
            value={stringToServiceStatus(key)}
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
          accessibilityLabel="Choose Service Status"
          placeholder="Choose Service Status"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size={5}/>
          }}
          mt="1"
          onValueChange={(value) => onSelect(stringToServiceStatus(value))}
        >
          {buildServiceStatusOptions()}
        </Select>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
          {errorMessage && errorMessage}
        </FormControl.ErrorMessage>
      </FormControl>
    </>
  );
};

export default ServiceStatusSelect;

