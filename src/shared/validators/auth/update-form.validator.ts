import {ServiceBranch, ServiceStatus} from "../../models/users";
import {
    validateBranch,
    validateServiceStatus,
} from "./validators";

export type UpdateFormValidationResponse = {
    firstName: string|null;
    lastName: string|null;
    branch: string|null;
    serviceStatus: string|null;
    serviceEntryDate: string|null;
    serviceExitDate: string|null;
}

export const updateFormValidator = (
    formState: {
        firstName: string;
        lastName: string;
        branch: ServiceBranch;
        serviceStatus: ServiceStatus;
        serviceEntryDate: string;
        serviceExitDate: string;
    },
): UpdateFormValidationResponse => {
    const { firstName, lastName, branch, serviceStatus, serviceEntryDate, serviceExitDate } = formState;

    return {
        firstName: null,
        lastName: null,
        serviceEntryDate: null,
        serviceExitDate: null,
        branch: validateBranch(branch),
        serviceStatus: validateServiceStatus(serviceStatus)
    };
}
