import {object, string} from "yup";

export const CreatePostSchema = object({
    title: string()
        .required('A Title is required')
        .max(50, 'Title must be less than 50 characters')
        .min(5, 'Title must be at least 5 characters'),
    ghillie: string()
        .required('A ghillie must be selected'),
    content: string()
        .required("A post must contain content")
        .min(5, 'Content must be at least 5 characters')
        .max(1000, 'Content must be less than 1000 characters'),
    status: string()
        .required('A status must be selected')
});
