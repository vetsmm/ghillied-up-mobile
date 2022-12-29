import React from "react";
import MainContainer from "../../../../components/containers/MainContainer";
import {Image, TouchableOpacity} from "react-native";
import styles from "./styles";
import {ScrollView, Text, View} from "native-base";
import {SharedElement} from "react-navigation-shared-element";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {colorsVerifyCode} from "../../../../components/colors";
import {convertDateTimeFromServer} from "../../../../shared/utils/date-utils";
import {useNavigation} from "@react-navigation/native";
import {NavigationProp} from "@react-navigation/core/src/types";
import {useSelector} from "react-redux";
import {IRootState} from "../../../../store";


export const GhillieSettingsScreen: React.FC = () => {

    const navigation: NavigationProp<any> = useNavigation();

    const ghillie = useSelector(
        (state: IRootState) => state.ghillie.ghillie
    );

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    }

    return (
        <MainContainer style={styles.container}>
            <ScrollView style={styles.list}>
                <SharedElement id={`ghillie#${ghillie}-Image`}>
                    <Image
                        style={{
                            height: 250,
                            width: '100%',
                            borderBottomLeftRadius: 50,
                            borderBottomRightRadius: 50,
                        }}
                        source={
                            ghillie?.imageUrl
                                ? {uri: ghillie?.imageUrl}
                                : require("../../../../../assets/logos/logo.png")
                        }
                    />
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 250,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        top: 0,
                        opacity: 0.5
                    }}/>
                </SharedElement>

                <View style={styles.ghillieDetailsContainer}>
                    <Text style={styles.ghillieTitle}>{ghillie.name}</Text>
                    <Text style={styles.ghillieDescription}>{ghillie.about}</Text>
                    <Text style={styles.ghillieCreatedDate}>Created
                        On: {convertDateTimeFromServer(ghillie.createdDate)}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Admin Tools</Text>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={() => moveTo("GhillieUpdate")}
                    >
                        <Text style={styles.sectionButtonText}>Update Ghillie</Text>
                        <Ionicons name="chevron-forward" size={24} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={() => moveTo("UpdateGhillieTopics")}
                    >
                        <Text style={styles.sectionButtonText}>Update Topics</Text>
                        <Ionicons name="chevron-forward" size={24} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={() => moveTo("UpdateGhillieCategory")}
                    >
                        <Text style={styles.sectionButtonText}>Change Category</Text>
                        <Ionicons name="chevron-forward" size={24} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Member Tools</Text>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        // onPress={button.onPress}
                    >
                        <Text style={styles.sectionButtonText}>Invite via Invite Code: {ghillie.inviteCode}</Text>
                        <Ionicons name="copy-outline" size={24} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        // onPress={button.onPress}
                    >
                        <Text style={styles.sectionButtonText}>Share Ghillie</Text>
                        <Ionicons name="share-social" size={24} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        // onPress={button.onPress}
                    >
                        <Text style={styles.sectionButtonText}>Leave Ghillie</Text>
                        <MaterialIcons name="logout" size={24} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.leaveGhillieButton}
                    // onPress={button.onPress}
                >
                    <Text style={styles.reportButtonText}>Report Ghillie</Text>
                    <Ionicons name="alert-circle" size={24} color={colorsVerifyCode.failLighter}/>
                </TouchableOpacity>
            </ScrollView>
        </MainContainer>
    )
}

export default GhillieSettingsScreen;
