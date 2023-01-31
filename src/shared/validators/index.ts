import {
    LoginFormSchema,
    PasswordChangeFormSchema,
    PasswordResetFormSchema,
    PasswordResetInitFormSchema,
    RegisterFormSchema,
    UpdateUserInfoFormSchema,
    UpdateUserPhoneNumberSchema,
} from "./auth";
import {CreatePostSchema} from "./posts";
import {
    CreateGhillieFormSchema,
    UpdateGhillieFormSchema,
    UpdateGhillieMemberSettingsFormSchema
} from "./ghillies";
import {IsBadWord} from "./utils";
import {
    CreateCommentFormSchema,
    CreateCommentReplyFormSchema,
    UpdateCommentFormSchema,
    UpdateCommentReplyFormSchema
} from "./comment.validator";

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
    UpdateGhillieFormSchema,
    UpdateGhillieMemberSettingsFormSchema,
    CreateCommentFormSchema,
    UpdateCommentFormSchema,
    CreateCommentReplyFormSchema,
    UpdateCommentReplyFormSchema,
    UpdateUserPhoneNumberSchema
}
