import {BaseApiException} from "../../models/exceptions/base-api.exception";

type FormErrors = {
  title: string | null;
  content: string | null;
  status: string | null;
  postTagNames: string | null;
  ghillieId: string | null;
}

const handleCreatePostError = (error: BaseApiException): FormErrors => {
  const errorContext: FormErrors = {
    title: null,
    content: null,
    status: null,
    ghillieId: null,
    postTagNames: null,
  };

  Object.keys(error.context).forEach((key) => {
    errorContext[key] = error.context[key];
  });
  return errorContext;
}

const handleUpdatePostError = (error: BaseApiException): { content: string | null } => {
  const errorContext = {
    content: null,
  };

  Object.keys(error.context).forEach((key) => {
    errorContext[key] = error.context[key];
  });
  return errorContext;
}

const postErrorHandler = {
  handleCreatePostError,
  handleUpdatePostError
}

export default postErrorHandler;
