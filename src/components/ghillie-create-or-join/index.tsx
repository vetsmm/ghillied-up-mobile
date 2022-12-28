import React from "react";
import {Icon, Text, View} from "native-base";
import {colorsVerifyCode} from "../colors";
import {TouchableOpacity} from "react-native-gesture-handler";
import {Entypo} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/core";
import CodeInputModal from "../code-input-modal";
import GhillieService from "../../shared/services/ghillie.service";

export const GhillieCreateOrJoin: React.FC = () => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [code, setCode] = React.useState("");
    const [isJoining, setIsJoining] = React.useState(false);
    const [error, setError] = React.useState("");

    const navigation: any = useNavigation();

    const handleCreateNavigate = () => {
        navigation.navigate("GhillieCreate");
    }

    const onEnterCodePress = () => {
        setIsJoining(true);
        if (code.length !== 6) {
            setError("Code must be 6 characters long");
            setIsJoining(false);
            return;
        } else {
            setError("");
        }

        GhillieService.joinGhillieByCode(code)
            .then((ghillie) => {
                setIsJoining(false);
                setModalVisible(false);
                navigation.navigate("GhillieDetail", {ghillieId: ghillie.id});
            })
            .catch((e) => {
                console.log(e.data.error.message);
                setIsJoining(false);
                setError(e.data.error.message || "Something went wrong while joining the Ghillie, please try again");
            });
    }

    return (
        <>
            <View alignItems={"center"} mt={"5%"}>
                <Text style={{
                    color: colorsVerifyCode.white,
                    alignSelf: "center",
                    fontSize: 18,
                    marginBottom: 10
                }}>
                    Don't See what you're looking for?
                </Text>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <View style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginRight: "5%"
                    }}>
                        <TouchableOpacity
                            style={{
                                borderRadius: 80,
                                borderWidth: 1,
                                height: 50,
                                width: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: colorsVerifyCode.secondary
                            }}
                            onPress={() => handleCreateNavigate()}
                        >
                            <Icon
                                as={Entypo}
                                name="plus"
                                size={18}
                                color={colorsVerifyCode.white}
                            />
                        </TouchableOpacity>
                        <Text style={{
                            color: colorsVerifyCode.secondary,
                            alignSelf: "center"
                        }}>
                            Create Ghillie
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginLeft: "5%"
                    }}>
                        <TouchableOpacity
                            style={{
                                borderRadius: 80,
                                borderWidth: 1,
                                height: 50,
                                width: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: colorsVerifyCode.secondary
                            }}
                            onPress={() => setModalVisible(true)}
                        >
                            <Icon
                                as={Entypo}
                                name="key"
                                size={18}
                                color={colorsVerifyCode.white}
                            />
                        </TouchableOpacity>
                        <Text style={{
                            color: colorsVerifyCode.secondary,
                            alignSelf: "center"
                        }}>
                            Use Invite Code
                        </Text>
                    </View>
                </View>
            </View>

            <CodeInputModal
                visible={modalVisible}
                codeValue={code}
                setCodeValue={setCode}
                onDismiss={() => setModalVisible(false)}
                onCodeSubmit={() => onEnterCodePress()}
                error={error}
                headerText={"Enter Invite Code"}
                buttonText={"Join"}
                isLoading={isJoining}
                codeLength={6}
                autoCapitalize={true}
            />
        </>
    );
}

export default GhillieCreateOrJoin;