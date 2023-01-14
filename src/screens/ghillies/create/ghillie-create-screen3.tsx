import React, {useState} from 'react';
import {Formik} from 'formik';
import {ActivityIndicator} from 'react-native';

import {VStack} from "native-base";
import {colorsVerifyCode} from "../../../components/colors";
import MainContainer from "../../../components/containers/MainContainer";
import KeyboardAvoidingContainer from "../../../components/containers/KeyboardAvoidingContainer";
import StyledTextInput from "../../../components/inputs/styled-text-input";
import MsgBox from "../../../components/texts/message-box";
import RegularButton from "../../../components/buttons/regular-button";
import StyledTextFieldInput from "../../../components/inputs/styled-text-field-input";
import StyledCheckboxInput from "../../../components/inputs/styled-checkbox-input";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import GhillieService from "../../../shared/services/ghillie.service";
import ghillieErrorHandler from "../../../shared/handlers/errors/ghillie-error.handler";
import {ImagePickerResult} from 'expo-image-picker';
import ImageUploader from '../../../components/upload/image-upload';
import {CreateGhillieInputDto} from '../../../shared/models/ghillies/create-ghillie-input.dto';
import {GhillieCategory} from "../../../shared/models/ghillies/ghillie-category";
import {ValidationSchemas} from "../../../shared/validators";


const {primary} = colorsVerifyCode;

const GhillieCreateScreen3 = ({route, navigation}) => {
        const {category, topics} = route.params;

        const [message, setMessage] = useState<string | null>('');
        const [isSuccessMessage, setIsSuccessMessage] = useState(false);

        const isAdmin = useSelector(
            (state: IRootState) => state.authentication.isAdmin
        );


        type FormErrors = {
            name: string | null;
            about: string | null;
            readOnly: boolean | null;
            isPrivate: boolean | null;
            adminInviteOnly: boolean | null;
            ghillieLogo: string | null;
            topicNames: string | null;
        }
        const [formErrors, setFormErrors] = useState<FormErrors>({
            name: null,
            about: null,
            readOnly: null,
            isPrivate: null,
            adminInviteOnly: null,
            ghillieLogo: null,
            topicNames: null
        });

        const moveTo = (screen, payload?) => {
            navigation.navigate(screen, {...payload});
        };

        const handleCreate = async (formData: any, setSubmitting) => {
            setMessage(null);

            const nonFormData = {
                name: formData.name,
                about: formData.about,
                readOnly: formData.readOnly,
                topicNames: formData.topicNames,
                isPrivate: formData.isPrivate,
                adminInviteOnly: formData.adminInviteOnly,
                category: category
            } as CreateGhillieInputDto;

            let hasError = false;
            let ghillieId: string | null = null;

            await GhillieService.createGhillie(nonFormData)
                .then((res) => {
                    ghillieId = res.data.id;
                })
                .catch(error => {
                    setSubmitting(false);
                    hasError = true;
                    setIsSuccessMessage(false);
                    const errorContext = ghillieErrorHandler.handleCreateGhillieError(error.data.error);
                    setFormErrors(errorContext);
                    if (error?.data?.error?.message) {
                        setMessage(error.data.error.message || 'Something went wrong while creating ghillie, please try again later.');
                    }
                });

            if (!hasError && ghillieId) {
                GhillieService.updateGhillieImage(ghillieId, formData.ghillieLogo?.assets?.[0]?.uri)
                    .then((res) => {
                        setSubmitting(false);
                        setIsSuccessMessage(true);
                        moveTo('GhillieDetail', {ghillieId});
                    })
                    .catch(error => {
                        setIsSuccessMessage(false);
                        setMessage(error?.data?.error?.message || 'Something went wrong while creating logo, please try again later.');
                        if (error?.data?.error) {
                            const errorContext = ghillieErrorHandler.handleCreateGhillieError(error.data.error);
                            setFormErrors({
                                ...formErrors,
                                ghillieLogo: errorContext.ghillieLogo
                            });
                        }
                    });
            } else {
                setSubmitting(false);
            }
        }

        const _validateForm = (formData) => {
            try {
                ValidationSchemas.CreateGhillieFormSchema
                    .validateSync(formData, {abortEarly: false});
                return {};
            } catch (e: any) {
                let errors = {};
                e.inner.reduce((acc, curr) => {
                    if (curr.message) {
                        errors[curr.path] = curr.message;
                    }
                }, {});

                return errors;
            }
        }

        return (
            <MainContainer>
                <KeyboardAvoidingContainer>
                    <VStack style={{margin: 25, marginBottom: 100}}>
                        <Formik
                            initialValues={{
                                name: '',
                                about: '',
                                ghillieLogo: null as unknown as ImagePickerResult,
                                category: GhillieCategory[category],
                                topicNames: topics,
                                readOnly: false,
                                adminInviteOnly: false,
                                isPrivate: false
                            }}
                            validate={_validateForm}
                            validateOnChange={false}
                            validateOnBlur={false}
                            onSubmit={(values, {setSubmitting}) => {
                                handleCreate(values, setSubmitting);
                            }}
                        >
                            {({
                                  handleChange,
                                  setFieldValue,
                                  handleBlur,
                                  handleSubmit,
                                  values,
                                  isSubmitting,
                                  errors,
                              }) => (
                                <>

                                    <ImageUploader
                                        setImage={(image) => setFieldValue('ghillieLogo', image)}
                                        imageUri={values?.ghillieLogo?.assets?.[0]?.uri}
                                    />

                                    {formErrors.ghillieLogo && (
                                        <MsgBox success={false} style={{marginBottom: 5}}>
                                            {formErrors.ghillieLogo || ' '}
                                        </MsgBox>
                                    )}
                                    {errors.ghillieLogo && (
                                        <MsgBox success={false} style={{marginBottom: 5}}>
                                            {/* @ts-ignore */}
                                            {errors.ghillieLogo}
                                        </MsgBox>
                                    )}

                                    <StyledTextInput
                                        label="Ghillie Name"
                                        icon="account-outline"
                                        placeholder="US Marine Corps"
                                        keyboardType="default"
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        value={values.name}
                                        style={{marginBottom: 15}}
                                        isError={formErrors.name !== null}
                                    />

                                    {formErrors.name && (
                                        <MsgBox success={false} style={{marginBottom: 5}}>
                                            {formErrors.name || ' '}
                                        </MsgBox>
                                    )}
                                    {errors.name && (
                                        <MsgBox success={false} style={{marginBottom: 5}}>
                                            {errors.name}
                                        </MsgBox>
                                    )}

                                    <StyledTextFieldInput
                                        label="About"
                                        icon="email-variant"
                                        placeholder="Write some details about your Ghillie"
                                        keyboardType="default"
                                        onChangeText={handleChange('about')}
                                        onBlur={handleBlur('about')}
                                        value={values.about}
                                        style={{marginBottom: 15}}
                                        isError={formErrors.about !== null}
                                    />

                                    {formErrors.about && (
                                        <MsgBox success={false} style={{marginBottom: 5}}>
                                            {formErrors.about || ' '}
                                        </MsgBox>
                                    )}
                                    {errors.about && (
                                        <MsgBox success={false} style={{marginBottom: 5}}>
                                            {errors.about}
                                        </MsgBox>
                                    )}

                                    <StyledCheckboxInput
                                        label="Is this a private Ghillie? (Invite Only)"
                                        onValueChange={(value) => setFieldValue('isPrivate', value)}
                                        value={values.isPrivate}
                                        isError={false}
                                    />

                                    {formErrors.isPrivate && (
                                        <MsgBox success={false} style={{marginBottom: 5}}>
                                            {formErrors.isPrivate || ' '}
                                        </MsgBox>
                                    )}
                                    {errors.isPrivate && (
                                        <MsgBox success={false} style={{marginBottom: 5}}>
                                            {errors.isPrivate}
                                        </MsgBox>
                                    )}

                                    {values.isPrivate && (
                                        <>
                                            <StyledCheckboxInput
                                                label="Should only admins be able to invite people to this Ghillie?"
                                                onValueChange={(value) => setFieldValue('adminInviteOnly', value)}
                                                value={values.adminInviteOnly}
                                                isError={false}
                                            />

                                            {formErrors.adminInviteOnly && (
                                                <MsgBox success={false} style={{marginBottom: 5}}>
                                                    {formErrors.adminInviteOnly || ' '}
                                                </MsgBox>
                                            )}
                                            {errors.adminInviteOnly && (
                                                <MsgBox success={false} style={{marginBottom: 5}}>
                                                    {errors.adminInviteOnly}
                                                </MsgBox>
                                            )}
                                        </>
                                    )}

                                    {isAdmin && (
                                        <>
                                            <StyledCheckboxInput
                                                label="Is Read Only"
                                                onValueChange={(value) => setFieldValue('readOnly', value)}
                                                value={values.readOnly}
                                                isError={false}
                                            />

                                            {formErrors.readOnly && (
                                                <MsgBox success={false} style={{marginBottom: 5}}>
                                                    {formErrors.readOnly || ' '}
                                                </MsgBox>
                                            )}
                                            {errors.readOnly && (
                                                <MsgBox success={false} style={{marginBottom: 5}}>
                                                    {errors.readOnly}
                                                </MsgBox>
                                            )}
                                        </>
                                    )}

                                    {!isSubmitting && <RegularButton onPress={handleSubmit}>Create</RegularButton>}
                                    {isSubmitting && (
                                        <RegularButton disabled={true}>
                                            <ActivityIndicator size="small" color={primary}/>
                                        </RegularButton>
                                    )}
                                </>
                            )}
                        </Formik>
                    </VStack>
                </KeyboardAvoidingContainer>
            </MainContainer>
        );
    }
;

export default GhillieCreateScreen3;
