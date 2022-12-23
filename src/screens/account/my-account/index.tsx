import React, {useState} from "react";
import MainContainer from "../../../components/containers/MainContainer";
import styles from "./styles";
import {ScrollView, Text, View} from "native-base";
import {colorsVerifyCode} from "../../../components/colors";
import AccountOverviewCard from "../../../components/account-overview-card";
import {UserOutput} from "../../../shared/models/users/user-output.dto";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../store";
import {Linking, TouchableOpacity} from "react-native";
import * as MailComposer from 'expo-mail-composer';
import {useStateWithCallback} from "../../../shared/hooks";
import OkCancelModel from "../../../components/modals/ok-cancel-modal";
import RegularText from "../../../components/texts/regular-texts";
import AppConfig from "../../../config/app.config";
import idmeService from "../../../shared/services/idme.service";
import {getAccount, logout} from "../../../shared/reducers/authentication.reducer";
import MessageModal from "../../../components/modals/message-modal";
import UserService from "../../../shared/services/user.service";

export const MyAccount = () => {
    const [deleteOpen, setDeleteOpen] = useStateWithCallback(false);
    const [isDeactivating, setIsDeactivating] = useState(false);
    // Alert
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessageType, setModalMessageType] = useState(undefined);
    const [headerText, setHeaderText] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [buttonText, setButtonText] = useState('');

    const dispatch = useAppDispatch();

    const showModal = (type, headerText, message, buttonText) => {
        setModalMessageType(type);
        setHeaderText(headerText);
        setModalMessage(message);
        setButtonText(buttonText);
        setModalVisible(true);
    };

    const verifyMilitaryStatus = async () => {
        try {
            const response = await idmeService.verifyMilitaryStatus();
            if (response.status === "SUCCESS") {
                showModal('success', 'Military Status Verified', response.message, 'Ok');
                dispatch(getAccount());
            } else {
                showModal('fail', 'Military Status Verification Failed', response.message, 'Ok');
            }
        } catch (error: any) {
            showModal('fail', 'Military Status Verification Failed', error.data.error.message, 'Ok');
        }
    }

    const deactivateAccount = () => {
        setIsDeactivating(true);
        UserService.deactivateUser()
            .then(() => {
                setIsDeactivating(false);
                setDeleteOpen(false);
                alert('Account deactivation initiated. Please check your email for further instructions.');
                dispatch(logout());
            })
            .catch((error: any) => {
                setIsDeactivating(false);
                setDeleteOpen(false, () => {
                    showModal(
                        'fail',
                        'Failed To Deactivate',
                        `We encountered an error while initiating account deactivation. Please try again later or contact support.`,
                        'Ok'
                    );
                });
            });
    }

    const composeEmail = async () => {
        if (await MailComposer.isAvailableAsync()) {
            await MailComposer.composeAsync({
                recipients: [AppConfig.links.supportEmail],
                subject: 'Account Deactivation Question',
                body: 'Hello, I have some questions about deactivating my account...',
            });
        }
    }

    const myAccount: UserOutput = useSelector(
        (state: IRootState) => state.authentication.account
    );

    return (
        <MainContainer style={styles.container}>
            <ScrollView mb={30}>
                <AccountOverviewCard
                    account={myAccount}
                    onVerifyClick={verifyMilitaryStatus}
                />
                <View margin={10}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: colorsVerifyCode.fail,
                            borderRadius: 20,
                        }}
                        onPress={() => setDeleteOpen(true)}
                    >
                        <Text style={{
                            color: colorsVerifyCode.white,
                            fontWeight: "bold",
                            fontSize: 20,
                            textAlign: "center",
                            margin: 10
                        }}>
                            Deactivate Account
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <OkCancelModel
                isLoading={isDeactivating}
                modalVisible={deleteOpen}
                setModalVisible={setDeleteOpen}
                headerText={"Are you sure you want to deactivate your account?"}
                message={
                    <>
                        <RegularText style={{marginBottom: 20}}>
                            This action cannot be undone and you will no longer be
                            able to access your account. Some of your data such as posts, likes, comments. may remain,
                            but all of your personal information will be removed. You will be logged out upon
                            deactivation.
                        </RegularText>
                        <RegularText>If you are unsure, please contact us at </RegularText>
                        <TouchableOpacity
                            onPress={() => composeEmail()}>
                            <RegularText style={{color: colorsVerifyCode.white, fontSize: 16, fontWeight: 'bold'}}>
                                support@ghilliedup.com
                            </RegularText>
                        </TouchableOpacity>
                        <RegularText> or on </RegularText>
                        <TouchableOpacity onPress={() => Linking.openURL(AppConfig.links.discord)}>
                            <RegularText style={{color: colorsVerifyCode.white, fontSize: 16, fontWeight: 'bold'}}>
                                Discord
                            </RegularText>
                        </TouchableOpacity>
                    </>
                }
                rightButtonHandler={() => deactivateAccount()}
                leftButtonHandler={() => setDeleteOpen(false)}
                leftButtonText={"No"}
                rightButtonText={"DEACTIVATE"}
            />

            <MessageModal
                modalVisible={modalVisible}
                buttonHandler={() => setModalVisible(false)}
                type={modalMessageType}
                headerText={headerText}
                message={modalMessage}
                buttonText={buttonText}
            />
        </MainContainer>
    )
}

export default MyAccount;
