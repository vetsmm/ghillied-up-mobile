import React from "react";
import MainContainer from "../../../components/containers/MainContainer";
import styles from "./styles";
import {Box, ScrollView, Text, View} from "native-base";
import {colorsVerifyCode} from "../../../components/colors";
import AccountOverviewCard from "../../../components/account-overview-card";
import {UserOutput} from "../../../shared/models/users/user-output.dto";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import {TouchableOpacity} from "react-native";
import SmallText from "../../../components/texts/small-text";

export const MyAccount = () => {

    const verifyMilitaryStatus = () => {
        console.log("Verify Military Status");
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

                <Box
                    borderWidth={2}
                    borderColor={colorsVerifyCode.secondary}
                    borderRadius={20}
                    marginTop={10}
                >
                    <SmallText style={{
                        alignSelf: "center",
                        marginTop: 10,
                        fontSize: 15,
                    }}>
                        What you should know
                    </SmallText>

                    <SmallText style={{
                        alignSelf: "center",
                        marginTop: 5,
                        marginBottom: 10,
                        color: colorsVerifyCode.white,
                    }}>
                        Deleting your account will remove all of your posts, Ghillies, comments, etc.
                        Currently, there is no way to recover your account once it has been deleted.
                        With that being said, if you are unsure about deleting your account, please
                        contact us support@ghilliedup.com and we will be happy to assist you.
                    </SmallText>
                </Box>

                <View margin={10}>
                    <TouchableOpacity
                        style={{
                            borderColor: colorsVerifyCode.fail,
                            borderWidth: 3,
                            borderRadius: 20,
                        }}
                        // TODO - Add delete account functionality
                        onPress={() => console.log("Delete Account")}
                    >
                        <Text style={{
                            color: colorsVerifyCode.fail,
                            fontWeight: "bold",
                            fontSize: 20,
                            textAlign: "center",
                            margin: 10
                        }}>
                            Delete Account
                        </Text>
                        <Text style={{
                            color: colorsVerifyCode.white,
                            fontWeight: "bold",
                            fontSize: 12,
                            textAlign: "center",
                            margin: 10
                        }}>
                            Coming Soon...
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </MainContainer>
    )
}

export default MyAccount;
