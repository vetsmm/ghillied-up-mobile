import {array, boolean, object, string} from "yup";
import {IsBadWord} from "./utils";

export const CreateGhillieFormSchema = object({
    name: string()
        .required('A Ghillie name is required')
        .max(50, 'Ghillie name must be less than 50 characters')
        .min(3, 'Ghillie name must be at least 3 characters'),
    about: string()
        .required('About section is required')
        .max(400, 'About section must be less than 400 characters'),
    topicNames: array()
        .max(5, 'You can only select up to 5 topics')
        .test('isBadWord', 'Name contains an inappropriate word', (value) => {
            if (value === undefined) {
                return true;
            }
            return value.every((topicName: string) => !IsBadWord(topicName));
        }),
    ghillieLogo: object()
        .required('You must select a logo'),
    category: string()
        .required('You must select a category')
});

export const UpdateGhillieFormSchema = object({
    name: string()
        .required('A Ghillie name is required')
        .max(50, 'Ghillie name must be less than 50 characters')
        .min(3, 'Ghillie name must be at least 3 characters'),
    about: string()
        .required('About section is required')
        .max(400, 'About section must be less than 400 characters'),
    logo: object().nullable().optional(),
    readOnly: boolean().optional(),
    isPrivate: boolean().optional(),
    adminInviteOnly: boolean().optional(),
});
