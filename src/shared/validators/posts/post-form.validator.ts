import {CreatePostInputDto} from "../../models/posts/create-post-input.dto";
import {validate, ValidationError} from "class-validator";

export type CreatePostFormValidationResponse = {
  title: string | null;
  content: string | null;
  status: string | null;
  postTagNames: string | null;
  ghillieId: string | null;
}

export const createPostFormValidator = async (post: CreatePostInputDto): Promise<CreatePostFormValidationResponse> => {
  // Validate with class-validator
  return await validate(post)
    .then((errors) => {
      if (errors.length > 0) {
        return parseValidationErrors(errors);
      }
      return {
        title: null,
        content: null,
        status: null,
        postTagNames: null,
        ghillieId: null,
      }
    });
}

const parseValidationErrors = (errors: ValidationError[]): CreatePostFormValidationResponse => {
  const validationErrors = {
    title: null,
    content: null,
    status: null,
    postTagNames: null,
    ghillieId: null,
  } as CreatePostFormValidationResponse;

  errors.forEach((error) => {
      if (error.constraints) {
        if (error.property === "title") {
          validationErrors.title = error.constraints.minLength || error.constraints.maxLength;
        } else if (error.property === "content") {
          validationErrors.content = error.constraints.minLength || error.constraints.maxLength;
        } else if (error.property === "ghillieId") {
          validationErrors.ghillieId = error.constraints.isNotEmpty || error.constraints.isString;
        }
      }
    }
  );
  return validationErrors;
}
