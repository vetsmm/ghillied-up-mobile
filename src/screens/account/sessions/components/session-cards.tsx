import React from "react";
import {SessionDto} from "../../../../shared/models/sessions/session.dto";
import {StyleSheet, TouchableOpacity} from "react-native";
import {colorsVerifyCode} from "../../../../components/colors";
import {Badge, Box} from "native-base";
import SmallText from "../../../../components/texts/small-text";
import {getTimeAgo} from "../../../../shared/utils/date-utils";

export interface PastSessionCardProps {
    session: SessionDto;
    onSessionRemove: (id: string) => void;
}

export const PastSessionCard: React.FC<PastSessionCardProps> = ({session, onSessionRemove}) => (
    <Box style={styles.sessionBox}>
        <Box>
            <SmallText>Last Accessed: {getTimeAgo(session.updatedDate)}</SmallText>
            <SmallText>IP: {session.ipAddress}</SmallText>
            <SmallText>Country: {session.countryCode}</SmallText>
            <SmallText>Region: {session.region}</SmallText>
            <SmallText>City: {session.city}</SmallText>
            <SmallText>Phone Type: {session.operatingSystem}</SmallText>
        </Box>
        <Box>
            <TouchableOpacity onPress={() => onSessionRemove(session.id)}>
                <Badge colorScheme="danger" variant="outline">
                    <SmallText>Remove</SmallText>
                </Badge>
            </TouchableOpacity>
        </Box>
    </Box>
);

export interface CurrentSessionCardProps {
    session: SessionDto;
}

export const CurrentSessionCard: React.FC<CurrentSessionCardProps> = ({session}) => (
    <Box style={styles.sessionBoxCurrent}>
        <SmallText>IP: {session.ipAddress}</SmallText>
        <SmallText>Country: {session.countryCode}</SmallText>
        <SmallText>Region: {session.region}</SmallText>
        <SmallText>City: {session.city}</SmallText>
        <SmallText>Phone Type: {session.operatingSystem}</SmallText>
    </Box>
);

const styles = StyleSheet.create({
    sessionBoxCurrent: {
        padding: 20,
        marginLeft: "1%",
    },
    sessionBox: {
        padding: 20,
        marginLeft: "1%",
        borderBottomWidth: 1,
        borderBottomColor: colorsVerifyCode.secondary,
        flexDirection: "row",
        justifyContent: "space-between"
    }
});
