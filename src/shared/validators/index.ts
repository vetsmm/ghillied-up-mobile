import {
    LoginFormSchema,
    PasswordChangeFormSchema,
    PasswordResetFormSchema,
    PasswordResetInitFormSchema,
    RegisterFormSchema,
    UpdateUserInfoFormSchema
} from "./auth";
import {CreatePostSchema} from "./posts";
import {CreateGhillieFormSchema, UpdateGhillieFormSchema} from "./ghillies";
import {IsBadWord} from "./utils";

export const ValidationSchemas = {
    IsBadWord,
    CreatePostSchema,
    LoginFormSchema,
    RegisterFormSchema,
    UpdateUserInfoFormSchema,
    PasswordResetInitFormSchema,
    PasswordChangeFormSchema,
    PasswordResetFormSchema,
    CreateGhillieFormSchema,
    UpdateGhillieFormSchema
}
