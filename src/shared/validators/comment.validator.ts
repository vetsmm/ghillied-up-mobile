import {object, string} from "yup";
import {IsBadWord} from "./utils";

export const CreateCommentFormSchema = object({
    content: string()
        .required('Comment content is required')
        .min(1, 'Comment must be at least 1 character')
        .max(1000, 'Comment must be less than 1000 characters')
        .test('isBadWord', 'Comment contains inappropriate word(s)', (value) => {
            if (value === undefined) {
                return true;
            }
            return !IsBadWord(value);
        }),
    postId: string()
        .required('Post ID is required'),
});

export const UpdateCommentFormSchema = object({
    content: string()
        .required('Comment content is required')
        .min(1, 'Comment must be at least 1 character')
        .max(1000, 'Comment must be less than 1000 characters')
        .test('isBadWord', 'Comment contains inappropriate word(s)', (value) => {
            if (value === undefined) {
                return true;
            }
            return !IsBadWord(value);
        }),
});

export const CreateCommentReplyFormSchema = object({
    content: string()
        .required('Comment content is required')
        .min(1, 'Comment must be at least 1 character')
        .max(1000, 'Comment must be less than 1000 characters')
        .test('isBadWord', 'Comment contains inappropriate word(s)', (value) => {
            if (value === undefined) {
                return true;
            }
            return !IsBadWord(value);
        }),
    parentCommentId: string()
        .required('Parent comment ID is required'),
});

export const UpdateCommentReplyFormSchema = object({
    content: string()
        .required('Comment content is required')
        .min(1, 'Comment must be at least 1 character')
        .max(1000, 'Comment must be less than 1000 characters')
        .test('isBadWord', 'Comment contains inappropriate word(s)', (value) => {
            if (value === undefined) {
                return true;
            }
            return !IsBadWord(value);
        })
});
