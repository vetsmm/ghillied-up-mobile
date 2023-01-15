import React, {useState} from 'react';

import {Formik} from 'formik';
import {ActivityIndicator, StyleSheet} from 'react-native';

import {View} from "native-base";
import {colorsVerifyCode} from "../../../../components/colors";
import MainContainer from "../../../../components/containers/MainContainer";
import KeyboardAvoidingContainer from "../../../../components/containers/KeyboardAvoidingContainer";
import MsgBox from "../../../../components/texts/message-box";
import RegularButton from "../../../../components/buttons/regular-button";
import {useSelector} from "react-redux";
import {IRootState} from "../../../../store";
import GhillieService from "../../../../shared/services/ghillie.service";
import {ValidationSchemas} from "../../../../shared/validators";
import {FlashMessageRef} from "../../../../components/flash-message/index";
import {GhillieMemberDto} from "../../../../shared/models/ghillies/ghillie-member.dto";
import ItemToggle from "../../../../components/item-toggle";
import {getStatusBarHeight, isIphoneX} from "react-native-iphone-x-helper";


const {primary} = colorsVerifyCode;

export const GhillieMemberSettingsScreen: React.FC = ({navigation}: any) => {
        const [ghillieMemberSettings, setGhillieMemberSettings] = useState<GhillieMemberDto>();
        const [loadingMemeberSettings, setLoadingMemberSettings] = useState<boolean>(false);

        const ghillieId = useSelector(
            (state: IRootState) => state.ghillie.ghillie.id
        );

        React.useEffect(() => {
            getGhillieMemberSettings();
        }, [ghillieId]);

        const getGhillieMemberSettings = () => {
            setLoadingMemberSettings(true);
            GhillieService.getGhillieMemberSettings(ghillieId)
                .then((res) => {
                    setGhillieMemberSettings(res);
                    setLoadingMemberSettings(false);
                })
                .catch((err) => {
                    setLoadingMemberSettings(false);
                    FlashMessageRef.current?.showMessage({
                        message: err?.data?.error?.message || 'Unable to retrieve member settings',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });

                    navigation.goBack();
                });
        }

        const haveSettingsBeenUpdated = (form) => {
            return form.newPostNotifications !== ghillieMemberSettings?.newPostNotifications;
        }

        const handleUpdate = (form, setSubmitting) => {
            if (haveSettingsBeenUpdated(form)) {
                GhillieService.updateGhillieMemberSettings(ghillieId, form)
                    .then((res) => {
                        setSubmitting(false);
                        FlashMessageRef.current?.showMessage({
                            message: 'Member settings updated',
                            type: 'success',
                            style: {
                                justifyContent: 'center',
                                alignItems: 'center',
                            }
                        });
                        setGhillieMemberSettings(res);
                    })
                    .catch(error => {
                        setSubmitting(false);
                        FlashMessageRef.current?.showMessage({
                            message: error?.data?.error?.message || 'Something went wrong while updating ghillie, please try again later.',
                            type: 'danger',
                            style: {
                                justifyContent: 'center',
                                alignItems: 'center',
                            }
                        });
                    });
            } else {
                console.log("no changes");
                setLoadingMemberSettings(false);
            }
        }

        const _validateForm = (formData) => {
            try {
                ValidationSchemas.UpdateGhillieMemberSettingsFormSchema
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

        if (loadingMemeberSettings) {
            return (
                <MainContainer style={styles.container}>
                    <ActivityIndicator size="large" color={primary}/>
                </MainContainer>
            );
        }
        return (
            <MainContainer style={styles.container}>
                <KeyboardAvoidingContainer>
                    <View style={styles.section}>
                        <Formik
                            initialValues={{
                                newPostNotifications: ghillieMemberSettings?.newPostNotifications || true,
                            }}
                            validate={_validateForm}
                            validateOnChange={false}
                            validateOnBlur={false}
                            onSubmit={(values, {setSubmitting}) => handleUpdate(values, setSubmitting)}
                        >
                            {({
                                  setFieldValue,
                                  handleSubmit,
                                  values,
                                  isSubmitting,
                                  errors,
                              }) => (
                                <>
                                    <ItemToggle
                                        title="Get Notified of New Posts"
                                        value={values.newPostNotifications}
                                        onValueChange={((value) => setFieldValue('newPostNotifications', value))}
                                        isLoading={isSubmitting}
                                    />

                                    {errors.newPostNotifications && (
                                        <MsgBox success={false} style={{marginBottom: 5}}>
                                            {errors.newPostNotifications}
                                        </MsgBox>
                                    )}

                                    {/* Pin to Bottom of Screen */}
                                    <View style={styles.buttonContainer}>
                                        {!isSubmitting && <RegularButton onPress={handleSubmit}>Update</RegularButton>}
                                        {isSubmitting && (
                                            <RegularButton disabled={true}>
                                                <ActivityIndicator size="small" color={primary}/>
                                            </RegularButton>
                                        )}
                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                </KeyboardAvoidingContainer>
            </MainContainer>
        );
    }
;

export default GhillieMemberSettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        paddingTop: isIphoneX() ? getStatusBarHeight() + 20 : 30,
        backgroundColor: colorsVerifyCode.primary
    },
    section: {
        marginBottom: 20,
        marginTop: 40,
    },
    // pin button to bottom of screen
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36,
    },
});
