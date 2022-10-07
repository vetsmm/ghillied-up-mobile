import {BaseApiException} from "../../models/exceptions/base-api.exception";

export type UpdateUserFormErrors = {
    firstName: string | null,
    lastName: string | null,
    branch: string | null;
    serviceStatus: string | null;
    serviceEntryDate: string | null;
    serviceExitDate: string | null;
}

const handleUpdateError = (error: BaseApiException): UpdateUserFormErrors => {
    const errorContext: UpdateUserFormErrors = {
        firstName: null,
        lastName: null,
        branch: null,
        serviceStatus: null,
        serviceEntryDate: null,
        serviceExitDate: null,
    };

    Object.keys(error.context).forEach((key) => {
        errorContext[key] = error.context[key];
    });
    return errorContext;
}

const userErrorHandler = {
    handleUpdateError
}

export default userErrorHandler;
