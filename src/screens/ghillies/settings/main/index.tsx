import React from "react";
import MainContainer from "../../../../components/containers/MainContainer";
import {ActivityIndicator, Image, TouchableOpacity} from "react-native";
import styles from "./styles";
import {ScrollView, Text, View} from "native-base";
import {SharedElement} from "react-navigation-shared-element";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {colorsVerifyCode} from "../../../../components/colors";
import {convertDateTimeFromServer} from "../../../../shared/utils/date-utils";
import {useNavigation} from "@react-navigation/native";
import {NavigationProp} from "@react-navigation/core/src/types";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../../store";
import GhillieService from "../../../../shared/services/ghillie.service";
import {getGhillie} from "../../../../shared/reducers/ghillie.reducer";
import {FlashMessageRef} from "../../../../app/App";
import {GhillieRole} from "../../../../shared/models/ghillies/ghillie-role";
import * as Clipboard from 'expo-clipboard';
import {ReportMenuDialog} from "../../../../components/reporting/report-menu-dialog";
import {FlagCategory} from "../../../../shared/models/flags/flag-category";
import flagService from "../../../../shared/services/flag.service";
import ShareUtils from "../../../../shared/utils/share-utils";


export const GhillieSettingsScreen: React.FC = () => {

    const [isGeneratingCode, setIsGeneratingCode] = React.useState(false);
    const [isLeavingGhillie, setIsLeavingGhillie] = React.useState(false);
    const [isReportDialogOpen, setIsReportDialogOpen] = React.useState(false);


    const navigation: NavigationProp<any> = useNavigation();
    const dispatch = useAppDispatch();
    const cancelRef = React.useRef(null);


    const ghillie = useSelector(
        (state: IRootState) => state.ghillie.ghillie
    );

    const isModerator = useSelector(
        (state: IRootState) =>
            state.ghillie.ghillie.memberMeta !== null &&
            (
                state.ghillie.ghillie.memberMeta?.role === GhillieRole.OWNER ||
                state.ghillie.ghillie.memberMeta?.role === GhillieRole.MODERATOR
            )
    );

    const isAdmin = useSelector(
        (state: IRootState) => state.authentication.isAdmin
    );

    const isAdminOrModerator = isAdmin || isModerator;

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    }

    const generateInviteCode = () => {
        setIsGeneratingCode(true);
        GhillieService.generateInviteCode(ghillie.id)
            .then(() => {
                dispatch(getGhillie(ghillie.id));
                setIsGeneratingCode(false);
                FlashMessageRef.current?.showMessage({
                    message: 'Invite code generated successfully',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .catch((err) => {
                setIsGeneratingCode(false);
                FlashMessageRef.current?.showMessage({
                    message: 'Error generating invite code, please try again',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    const onSocialSharePress = () => {
        ShareUtils.shareGhillie(ghillie)
            .catch(() => {
                FlashMessageRef.current?.showMessage({
                    message: `Error sharing ghillie, please try again`,
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    const copyCodeToClipboard = async () => {
        try {
            await Clipboard.setStringAsync(ghillie.inviteCode!);
            const text = await Clipboard.getStringAsync();
            FlashMessageRef.current?.showMessage({
                message: 'Invite code copied to clipboard: ' + text,
                type: 'success',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        } catch (e) {
            FlashMessageRef.current?.showMessage({
                message: 'Error copying invite code to clipboard',
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }
    }

    const reportGhillie = (category: FlagCategory, details: string) => {
        flagService.flagGhillie({
            ghillieId: ghillie.id,
            flagCategory: category,
            details
        })
            .then(() => {
                FlashMessageRef.current?.showMessage({
                    message: 'Report Sent! Thank you for your help',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .catch((err) => {
                FlashMessageRef.current?.showMessage({
                    message: 'An error occurred while reporting the ghillie.',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    const onLeaveGhillie = () => {
        setIsLeavingGhillie(true);
        GhillieService.leaveGhillie(ghillie.id)
            .then(() => {
                setIsLeavingGhillie(false);
                FlashMessageRef.current?.showMessage({
                    type: 'success',
                    message: 'You have left the ghillie',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                moveTo('GhillieListing');
            })
            .catch((err) => {
                setIsLeavingGhillie(false);
                FlashMessageRef.current?.showMessage({
                    message: 'Error leaving ghillie, please try again',
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            });
    }

    const _renderShareButtons = () => {
        if (!ghillie.adminInviteOnly) {
            return (
                <>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={copyCodeToClipboard}
                    >
                        <Text style={styles.sectionButtonText}>Invite via Invite
                            Code: {ghillie.inviteCode}</Text>
                        <Ionicons name="copy-outline" size={24} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={() => onSocialSharePress()}
                    >
                        <Text style={styles.sectionButtonText}>Share Ghillie</Text>
                        <Ionicons name="share-social" size={24} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                </>
            )
        } else if (isAdminOrModerator) {
            return (
                <>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={() => copyCodeToClipboard()}
                    >
                        <Text style={styles.sectionButtonText}>Invite via Invite
                            Code: {ghillie.inviteCode}</Text>
                        <Ionicons name="copy-outline" size={24} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={() => onSocialSharePress()}
                    >
                        <Text style={styles.sectionButtonText}>Share Ghillie</Text>
                        <Ionicons name="share-social" size={24} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                </>
            )
        }

        return null;
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
                    {!ghillie.inviteCode && (
                        <TouchableOpacity
                            style={styles.sectionButton}
                            onPress={() => generateInviteCode()}
                        >
                            <Text style={styles.sectionButtonText}>Generate Invite Code</Text>
                            {isGeneratingCode
                                ? <ActivityIndicator size="small" color={colorsVerifyCode.secondary}/>
                                : <Ionicons name="chevron-forward" size={24} color={colorsVerifyCode.secondary}/>}
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Member Tools</Text>
                    {ghillie.inviteCode && _renderShareButtons()}
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={() => onLeaveGhillie()}
                        disabled={isLeavingGhillie}
                    >
                        <Text style={styles.sectionButtonText}>Leave Ghillie</Text>
                        {isLeavingGhillie
                            ? <ActivityIndicator size="small" color={colorsVerifyCode.secondary}/>
                            : <MaterialIcons name="logout" size={24} color={colorsVerifyCode.secondary}/>
                        }
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.leaveGhillieButton}
                    onPress={() => setIsReportDialogOpen(true)}
                >
                    <Text style={styles.reportButtonText}>Report Ghillie</Text>
                    <Ionicons name="alert-circle" size={24} color={colorsVerifyCode.failLighter}/>
                </TouchableOpacity>
            </ScrollView>

            <ReportMenuDialog
                isOpen={isReportDialogOpen}
                onClose={() => setIsReportDialogOpen(false)}
                cancelRef={cancelRef}
                onReport={reportGhillie}
            />
        </MainContainer>
    )
}

export default GhillieSettingsScreen;
