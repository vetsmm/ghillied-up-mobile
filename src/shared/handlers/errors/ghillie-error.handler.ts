import {BaseApiException} from "../../models/exceptions/base-api.exception";

type FormErrors = {
    name: string | null;
    about: string | null;
    readOnly: boolean | null;
    isPrivate: boolean | null;
    adminInviteOnly: boolean | null;
    ghillieLogo: string | null;
    topicNames: string | null;
}

const handleCreateGhillieError = (error: BaseApiException): FormErrors => {
    const errorContext: FormErrors = {
        name: null,
        about: null,
        readOnly: null,
        isPrivate: null,
        adminInviteOnly: null,
        ghillieLogo: null,
        topicNames: null,
    };

    Object.keys(error.context).forEach((key) => {
        errorContext[key] = error.context[key];
    });
    return errorContext;
}

const ghillieErrorHandler = {
    handleCreateGhillieError
}

export default ghillieErrorHandler;
