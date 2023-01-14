import React, {useState} from 'react';

import {Formik} from 'formik';
import {ActivityIndicator} from 'react-native';

import {VStack} from "native-base";
import {colorsVerifyCode} from "../../../../components/colors";
import MainContainer from "../../../../components/containers/MainContainer";
import KeyboardAvoidingContainer from "../../../../components/containers/KeyboardAvoidingContainer";
import StyledTextInput from "../../../../components/inputs/styled-text-input";
import MsgBox from "../../../../components/texts/message-box";
import RegularButton from "../../../../components/buttons/regular-button";
import StyledTextFieldInput from "../../../../components/inputs/styled-text-field-input";
import StyledCheckboxInput from "../../../../components/inputs/styled-checkbox-input";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../../store";
import GhillieService from "../../../../shared/services/ghillie.service";
import ghillieErrorHandler from "../../../../shared/handlers/errors/ghillie-error.handler";
import {updateGhillie} from "../../../../shared/reducers/ghillie.reducer";
import MessageModal from "../../../../components/modals/message-modal";
import ImageUploader from '../../../../components/upload/image-upload';
import {ImagePickerResult} from 'expo-image-picker';
import {UpdateGhillieDto} from '../../../../shared/models/ghillies/update-ghillie.dto';
import {ValidationSchemas} from "../../../../shared/validators";


const {primary} = colorsVerifyCode;

export const GhillieUpdateScreen: React.FC = () => {
        const [message, setMessage] = useState<string | null>('');
        const [isSuccessMessage, setIsSuccessMessage] = useState(false);

        // modal
        const [modalVisible, setModalVisible] = useState(false);
        const [modalMessageType, setModalMessageType] = useState('');
        const [headerText, setHeaderText] = useState('');
        const [modalMessage, setModalMessage] = useState('');
        const [buttonText, setButtonText] = useState('');

        const dispatch = useAppDispatch();

        const ghillie = useSelector(
            (state: IRootState) => state.ghillie.ghillie
        );

        const isAdmin = useSelector(
            (state: IRootState) => state.authentication.isAdmin
        );

        type FormErrors = {
            name: string | null;
            about: string | null;
            readOnly: boolean | null;
            ghillieLogo: string | null;
            isPrivate: boolean | null;
            adminInviteOnly: boolean | null;
        }
        const [formErrors, setFormErrors] = useState<FormErrors>({
            name: null,
            about: null,
            readOnly: null,
            isPrivate: null,
            adminInviteOnly: null,
            ghillieLogo: null,
        });

        const buttonHandler = () => {
            setModalVisible(false);
        };

        const showModal = (type: any, headerText: any, message: any, buttonText: any) => {
            setModalMessageType(type);
            setHeaderText(headerText);
            setModalMessage(message);
            setButtonText(buttonText);
            setModalVisible(true);
        };

        const hasGhillieBeenUpdated = (form) => {
            return form.name !== ghillie.name ||
                form.about !== ghillie.about ||
                form.readOnly !== ghillie.readOnly ||
                form.isPrivate !== ghillie.isPrivate ||
                form.adminInviteOnly !== ghillie.adminInviteOnly;
        }

        const handleUpdate = async (form, setSubmitting) => {
            setMessage(null);

            const nonFormData = {
                name: form.name,
                about: form.about,
                readOnly: form.readOnly,
                adminInviteOnly: form.adminInviteOnly,
                isPrivate: form.isPrivate,
            } as UpdateGhillieDto;

            let hasError = false;

            if (hasGhillieBeenUpdated(form)) {
                await GhillieService.updateGhillie(ghillie.id, nonFormData)
                    .then((res) => {
                        dispatch(updateGhillie(res.data));
                    })
                    .catch(error => {
                        hasError = true;
                        setIsSuccessMessage(false);
                        setMessage(error?.data?.error?.message || 'Something went wrong while updating ghillie, please try again later.');
                        if (error?.data?.error) {
                            const errorContext = ghillieErrorHandler.handleCreateGhillieError(error.data.error);
                            setFormErrors(errorContext);
                        }
                    });
            }

            if (form.ghillieLogo) {
                GhillieService.updateGhillieImage(ghillie.id, form.ghillieLogo?.assets?.[0]?.uri)
                    .then((res) => {
                        setIsSuccessMessage(true);
                        dispatch(updateGhillie(res));
                        showModal('success', 'Success', 'Ghillie updated successfully', 'OK');
                    })
                    .catch(error => {
                        setIsSuccessMessage(false);
                        setMessage(error?.data?.error?.message || 'Something went wrong while updating logo, please try again later.');
                        if (error?.data?.error) {
                            const errorContext = ghillieErrorHandler.handleCreateGhillieError(error.data.error);
                            setFormErrors({
                                ...formErrors,
                                ghillieLogo: errorContext.ghillieLogo
                            });
                        }
                    });
            } else {
                if (!hasError) {
                    setIsSuccessMessage(true);
                    showModal('success', 'Success', 'Ghillie updated successfully', 'OK');
                }
            }

            setSubmitting(false);
        }

        const _validateForm = (formData) => {
            try {
                ValidationSchemas.UpdateGhillieFormSchema
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
                                name: ghillie.name || '',
                                about: ghillie.about || '',
                                readOnly: ghillie.readOnly || false,
                                isPrivate: ghillie.isPrivate || false,
                                adminInviteOnly: ghillie.adminInviteOnly || false,
                                ghillieLogo: null as unknown as ImagePickerResult
                            }}
                            validate={_validateForm}
                            validateOnChange={false}
                            validateOnBlur={false}
                            onSubmit={(values, {setSubmitting}) => {
                                handleUpdate(values, setSubmitting);
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
                                        imageUri={values?.ghillieLogo?.assets?.[0]?.uri ?? ghillie.imageUrl}
                                    />

                                    {formErrors.ghillieLogo && (
                                        <MsgBox success={false} style={{marginBottom: 5}}>
                                            {formErrors.ghillieLogo}
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
                                        onBlur={handleBlur('name')}
                                        onChangeText={handleChange('name')}
                                        value={values.name}
                                        style={{marginBottom: 15}}
                                        isError={formErrors.name !== null}
                                    />

                                    {formErrors.name && (
                                        <MsgBox success={false} style={{marginBottom: 5}}>
                                            {formErrors.name}
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
                                            {formErrors.about}
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
                                            {formErrors.isPrivate}
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
                                                    {formErrors.adminInviteOnly}
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
                                                style={{marginBottom: 15}}
                                                isError={false}
                                            />

                                            {formErrors.readOnly && (
                                                <MsgBox success={false} style={{marginBottom: 5}}>
                                                    {formErrors.readOnly}
                                                </MsgBox>
                                            )}
                                            {errors.readOnly && (
                                                <MsgBox success={false} style={{marginBottom: 5}}>
                                                    {errors.readOnly}
                                                </MsgBox>
                                            )}
                                        </>
                                    )}

                                    {!isSubmitting && <RegularButton onPress={handleSubmit}>Update</RegularButton>}
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
                <MessageModal
                    modalVisible={modalVisible}
                    buttonHandler={buttonHandler}
                    type={modalMessageType}
                    headerText={headerText}
                    message={modalMessage}
                    buttonText={buttonText}
                />
            </MainContainer>
        );
    }
;

export default GhillieUpdateScreen;
