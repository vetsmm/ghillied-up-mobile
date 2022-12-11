import React from "react";
import {UserOutput} from "../../shared/models/users/user-output.dto";
import {Avatar, Box, View, VStack} from "native-base";
import {colorsVerifyCode} from "../colors";
import stringUtils from "../../shared/utils/string.utils";
import {ServiceBranch} from "../../shared/models/users";
import {
    AIR_FORCE_SEAL_PNG,
    AIR_NATIONAL_GUARD_SEAL_PNG,
    ARMY_NATIONAL_GUARD_SEAL_PNG,
    ARMY_SEAL_PNG,
    MARINE_CORPS_SEAL_PNG,
    NAVY_SEAL_PNG,
    SPACE_FORCE_SEAL_PNG,
    US_FLAG_PNG,
    COAST_GUARD_SEAL_PNG
} from "../../assets";
import RegularText from "../texts/regular-texts";
import {SvgXml} from "react-native-svg";
import {VERIFIED_MARK} from "../../shared/images/verified-mark";
import {TouchableOpacity} from "react-native";
import {ID_ME_VERIFY} from "../../shared/images/id-me-verify";

interface AccountOverviewCardProps {
    account: UserOutput;
    onVerifyClick: () => void;
}

export const AccountOverviewCard = ({account, onVerifyClick,}: AccountOverviewCardProps) => {

    const isVerifiedMilitary = account?.authorities?.includes("ROLE_VERIFIED_MILITARY");

    const getServiceSeal = (): any => {
        switch (account.branch) {
            case ServiceBranch.ARMY:
                return ARMY_SEAL_PNG
            case ServiceBranch.NAVY:
                return NAVY_SEAL_PNG;
            case ServiceBranch.AIR_FORCE:
                return AIR_FORCE_SEAL_PNG;
            case ServiceBranch.MARINES:
                return MARINE_CORPS_SEAL_PNG;
            // case ServiceBranch.COAST_GUARD:
            //     return COAST_GUARD_SEAL_PNG;
            case ServiceBranch.AIR_NATIONAL_GUARD:
                return AIR_NATIONAL_GUARD_SEAL_PNG;
            case ServiceBranch.ARMY_NATIONAL_GUARD:
                return ARMY_NATIONAL_GUARD_SEAL_PNG;
            case ServiceBranch.SPACE_FORCE:
                return SPACE_FORCE_SEAL_PNG;
            case ServiceBranch.COAST_GUARD:
                return COAST_GUARD_SEAL_PNG;
            default:
                return US_FLAG_PNG;
        }
    }

    return (
        <Box
            borderWidth={3}
            borderRadius={30}
            borderColor={colorsVerifyCode.secondary}
        >
            <VStack alignSelf="center" mt={3} mb={3} alignItems="center">
                <Avatar
                    width="40"
                    height="40"
                    source={getServiceSeal()}
                />
                <RegularText style={{
                    fontWeight: "bold",
                    fontSize: 25,
                }}
                >
                    {account.username}
                </RegularText>
                <View style={{
                    flexDirection: 'row',
                }}
                >
                    <RegularText
                        style={{fontWeight: "bold"}}
                    >
                        {stringUtils.enumStyleToSentence(account.serviceStatus)}
                    </RegularText>
                    <RegularText> | </RegularText>
                    <RegularText
                        style={{fontWeight: "bold"}}
                    >
                        {stringUtils.enumStyleToSentence(account.branch)}
                    </RegularText>
                </View>

                <VStack mt={5} justifyContent="center">
                    {isVerifiedMilitary ? (
                        <>
                            <SvgXml
                                style={{alignSelf: 'center'}}
                                xml={VERIFIED_MARK}
                                height="50"
                                width="50"
                            />
                            <RegularText style={{color: colorsVerifyCode.secondary}}>
                                Verified Military
                            </RegularText>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => onVerifyClick()}>
                            <RegularText style={{color: colorsVerifyCode.secondary, alignSelf: 'center'}}>
                                Verify Military Status
                            </RegularText>
                            <SvgXml
                                style={{alignSelf: 'center'}}
                                xml={ID_ME_VERIFY}
                                height="50"
                                width="200"
                            />
                        </TouchableOpacity>
                    )}
                </VStack>
            </VStack>
        </Box>
    );
}


export default AccountOverviewCard;
