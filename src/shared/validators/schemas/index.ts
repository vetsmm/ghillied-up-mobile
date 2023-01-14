import {date, object, ref, string} from "yup";

const CreatePostSchema = object({
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

const LoginFormSchema = object({
    username: string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username must be less than 20 characters long')
        .matches(/^[a-zA-Z0-9]+$/, 'Username must only contain letters and numbers'),
    password: string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(25, 'Password must be less than 25 characters long')
});

const RegisterFormSchema = object({
    email: string()
        .required('Email is required')
        .email('Email must be a valid email address'),
    username: string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username must be less than 20 characters long')
        .matches(/^[a-zA-Z0-9]+$/, 'Username must only contain letters and numbers'),
    password: string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(25, 'Password must be less than 25 characters long'),
    confirmPassword: string()
        .required('Confirm Password is required')
        .oneOf([ref('password')], 'Passwords must match'),
    branch: string()
        .required('Branch is required'),
    serviceStatus: string()
        .required('Service Status is required')
});

const UpdateUserInfoFormSchema = object({
    firstName: string()
        .optional()
        .max(30, 'First Name must be less than 30 characters'),
    lastName: string()
        .optional()
        .max(30, 'Last Name must be less than 30 characters'),
    branch: string()
        .required('Branch is required'),
    serviceStatus: string()
        .required('Service Status is required'),
    serviceEntryDate: date()
        .optional(),
    serviceExitDate: date()
        .optional()
});

const PasswordResetInitFormSchema = object({
    email: string()
        .required('Email is required')
        .email('Email must be a valid email address')
});

const PasswordChangeFormSchema = object({
    oldPassword: string()
        .required('Old Password is required')
        .min(8, 'Old Password must be at least 8 characters long')
        .max(25, 'Old Password must be less than 25 characters long'),
    newPassword: string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(25, 'Password must be less than 25 characters long'),
    confirmNewPassword: string()
        .required('Confirm Password is required')
        .oneOf([ref('newPassword')], 'Passwords must match')
});

const PasswordResetFormSchema = object({
    newPassword: string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(25, 'Password must be less than 25 characters long'),
    confirmNewPassword: string()
        .required('Confirm Password is required')
        .oneOf([ref('newPassword')], 'Passwords must match')
});

export const ValidationSchemas = {
    CreatePostSchema,
    LoginFormSchema,
    RegisterFormSchema,
    UpdateUserInfoFormSchema,
    PasswordResetInitFormSchema,
    PasswordChangeFormSchema,
    PasswordResetFormSchema
}
