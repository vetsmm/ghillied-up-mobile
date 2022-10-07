import React, {useState} from "react";
import styles from "./styles";
import {ScrollView, VStack} from "native-base";
import {Formik} from "formik";
import {ServiceBranch, ServiceStatus, stringToServiceBranch, stringToServiceStatus} from "../../../shared/models/users";
import StyledTextInput from "../../../components/inputs/styled-text-input";
import MsgBox from "../../../components/texts/message-box";
import StyledSelect from "../../../components/select/styled-select";
import stringUtils from "../../../shared/utils/string.utils";
import RegularButton from "../../../components/buttons/regular-button";
import {ActivityIndicator} from "react-native";
import KeyboardAvoidingContainer from "../../../components/containers/KeyboardAvoidingContainer";
import validators from "../../../shared/validators/auth";
import UserService from "../../../shared/services/user.service";
import {colorsVerifyCode} from "../../../components/colors";
import StyledDateTimeInput from "../../../components/inputs/styled-date-time.input";
import {UserOutput} from "../../../shared/models/users/user-output.dto";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../store";
import {
    UpdateFormValidationResponse
} from "../../../shared/validators/auth/update-form.validator";
import {UpdateUserInput} from "../../../shared/models/users/update-user.input";
import userErrorHandler, {UpdateUserFormErrors} from "../../../shared/handlers/errors/user-error.handler";
import {useNavigation} from "@react-navigation/native";
import {getAccount} from "../../../shared/reducers/authentication.reducer";
import MessageModal from "../../../components/modals/message-modal";


export const UpdateUserInformation = () => {
    const [message, setMessage] = useState<string | null>('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessageType, setModalMessageType] = useState('');
    const [headerText, setHeaderText] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [buttonText, setButtonText] = useState('');

    const dispatch = useAppDispatch();
    const navigation: any = useNavigation();

    const myAccount: UserOutput = useSelector(
        (state: IRootState) => state.authentication.account
    );

    React.useEffect(() => {
        const initialLoad = navigation.addListener('focus', () => {
            dispatch(getAccount())
        });

        return initialLoad;
    }, [navigation]);

    const showModal = (type, headerText, message, buttonText) => {
        setModalMessageType(type);
        setHeaderText(headerText);
        setModalMessage(message);
        setButtonText(buttonText);
        setModalVisible(true);
    };

    const [formErrors, setFormErrors] = useState<UpdateUserFormErrors>({
        firstName: null,
        lastName: null,
        branch: null,
        serviceStatus: null,
        serviceEntryDate: null,
        serviceExitDate: null,
    });

    const handleUpdate = (formData, setSubmitting) => {
        setMessage(null);

        const updateUserInput = UpdateUserInput.fromPartial(formData);

        UserService.updateUser(updateUserInput).then(() => {
            setSubmitting(false);
            showModal('success', 'All Good!', 'Your information has been updated.', 'Ok');
        }).catch(error => {
            setSubmitting(false);
            const errorContext = userErrorHandler.handleUpdateError(error.data.error);
            setFormErrors(errorContext);
            setMessage(error.data.error.message);
        });
    }

    const _isFormInvalid = (formData): boolean => {
        setMessage(null);

        const errors: UpdateFormValidationResponse = validators.updateFormValidator(formData);

        setFormErrors({
            firstName: errors.firstName,
            lastName: errors.lastName,
            branch: errors.branch,
            serviceStatus: errors.serviceStatus,
            serviceEntryDate: errors.serviceEntryDate,
            serviceExitDate: errors.serviceExitDate,
        });

        return Object.values(errors).some(error => error !== null);
    }

    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingContainer>
                <VStack style={{margin: 25}}>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            firstName: myAccount.firstName,
                            lastName: myAccount.lastName,
                            branch: myAccount.branch,
                            serviceStatus: myAccount.serviceStatus,
                            serviceEntryDate: new Date(myAccount.serviceEntryDate),
                            serviceExitDate: new Date(myAccount.serviceExitDate)
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            if (_isFormInvalid(values)) {
                                setSubmitting(false);
                            } else {
                                handleUpdate(values, setSubmitting);
                            }
                        }}
                    >
                        {({
                              handleChange,
                              setFieldValue,
                              handleBlur,
                              handleSubmit,
                              values,
                              isSubmitting
                          }) => (
                            <>
                                <StyledTextInput
                                    label="First Name"
                                    icon="account-outline"
                                    placeholder="Mark"
                                    keyboardType="default"
                                    onChangeText={handleChange('firstName')}
                                    onBlur={handleBlur('firstName')}
                                    value={values.firstName}
                                    style={{marginBottom: 25}}
                                    isError={formErrors.firstName !== null}
                                />

                                <MsgBox success={isSuccessMessage} style={{marginBottom: 2}}>
                                    {formErrors.firstName && formErrors.firstName}
                                </MsgBox>

                                <StyledTextInput
                                    label="Last Name"
                                    icon="account-outline"
                                    placeholder="Tripoli"
                                    keyboardType="default"
                                    onChangeText={handleChange('lastName')}
                                    onBlur={handleBlur('lastName')}
                                    value={values.lastName}
                                    style={{marginBottom: 25}}
                                    isError={formErrors.lastName !== null}
                                />

                                <MsgBox success={isSuccessMessage} style={{marginBottom: 2}}>
                                    {formErrors.lastName && formErrors.lastName}
                                </MsgBox>

                                <StyledSelect
                                    label={'Branch of Service'}
                                    accessibilityLabel={"Select your branch of services"}
                                    placeholder={'Select your branch of services'}
                                    initialValue={values.branch}
                                    options={
                                        Object.keys(ServiceBranch)
                                            .filter(key => stringToServiceBranch(key) !== ServiceBranch.UNKNOWN
                                                && stringToServiceBranch(key) !== ServiceBranch.NO_SERVICE
                                            )
                                            .map(value => {
                                                return {
                                                    value: stringToServiceBranch(value),
                                                    label: stringUtils.enumStyleToSentence(value)
                                                }
                                            })
                                    }
                                    onSelect={handleChange("branch")}
                                    isError={formErrors.branch !== null}
                                />

                                <MsgBox success={isSuccessMessage} style={{marginBottom: 2}}>
                                    {formErrors.branch || ' '}
                                </MsgBox>

                                <StyledSelect
                                    label={'Service Status'}
                                    accessibilityLabel={"Select your services status"}
                                    placeholder={'Select your services status'}
                                    initialValue={values.serviceStatus}
                                    options={
                                        Object.keys(ServiceStatus)
                                            .filter(key => stringToServiceStatus(key) !== ServiceStatus.UNKNOWN
                                                && stringToServiceStatus(key) !== ServiceStatus.CIVILIAN
                                            )
                                            .map(value => {
                                                return {
                                                    value: stringToServiceStatus(value),
                                                    label: stringUtils.enumStyleToSentence(value)
                                                }
                                            })
                                    }
                                    onSelect={handleChange("serviceStatus")}
                                    isError={formErrors.serviceStatus !== null}
                                />

                                <MsgBox success={isSuccessMessage} style={{marginBottom: 2}}>
                                    {formErrors.serviceStatus || ' '}
                                </MsgBox>

                                <StyledDateTimeInput
                                    pickerLabel="Service Entry Date"
                                    isError={false}
                                    mode="date"
                                    value={values.serviceEntryDate}
                                    display="default"
                                    onChange={(event, date) => setFieldValue("serviceEntryDate", date)}
                                />

                                <MsgBox success={isSuccessMessage} style={{marginBottom: 2}}>
                                    {formErrors.serviceEntryDate || ' '}
                                </MsgBox>

                                <StyledDateTimeInput
                                    pickerLabel="Service Exit Date"
                                    isError={false}
                                    mode="date"
                                    value={values.serviceExitDate}
                                    display="default"
                                    onChange={(event, date) => setFieldValue("serviceExitDate", date)}
                                />

                                <MsgBox success={isSuccessMessage} style={{marginBottom: 2}}>
                                    {formErrors.serviceExitDate || ' '}
                                </MsgBox>


                                {message && (
                                    <MsgBox
                                        style={{marginBottom: 25, marginTop: 20, fontSize: 20}}
                                        success={isSuccessMessage}>
                                        {message || ' '}
                                    </MsgBox>
                                )}

                                {!isSubmitting && <RegularButton onPress={handleSubmit}>Update</RegularButton>}
                                {isSubmitting && (
                                    <RegularButton disabled={true}>
                                        <ActivityIndicator size="small" color={colorsVerifyCode.primary}/>
                                    </RegularButton>
                                )}
                            </>
                        )}
                    </Formik>
                </VStack>
            </KeyboardAvoidingContainer>
            <MessageModal
                modalVisible={modalVisible}
                buttonHandler={() => setModalVisible(false)}
                type={modalMessageType}
                headerText={headerText}
                message={modalMessage}
                buttonText={buttonText}
            />
        </ScrollView>
    )
}

export default UpdateUserInformation;
