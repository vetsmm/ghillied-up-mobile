import {date, object, ref, string} from "yup";

export const LoginFormSchema = object({
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

export const RegisterFormSchema = object({
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

export const UpdateUserInfoFormSchema = object({
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

export const PasswordResetInitFormSchema = object({
    email: string()
        .required('Email is required')
        .email('Email must be a valid email address')
});

export const PasswordChangeFormSchema = object({
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

export const PasswordResetFormSchema = object({
    newPassword: string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(25, 'Password must be less than 25 characters long'),
    confirmNewPassword: string()
        .required('Confirm Password is required')
        .oneOf([ref('newPassword')], 'Passwords must match')
});
