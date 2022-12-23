import React from 'react';
import {Button, FlatList, View} from 'native-base';
import {IFlatListProps} from "native-base/src/components/basic/FlatList/types";
import {colorsVerifyCode} from "../colors";
import {Text} from "react-native";
import {useNavigation} from "@react-navigation/native";
import RegularText from "../texts/regular-texts";

interface VirtualizedViewProps extends IFlatListProps<any> {
    hideData?: boolean;
    isVerified?: boolean;
    isActive?: boolean;
}

export default function VirtualizedView({hideData, isVerified = true, isActive = true,  ...props}: VirtualizedViewProps) {
    const navigation: any = useNavigation();

    if (!isActive) {
        return (
            <FlatList
                {...props}
                data={[]}
                ListHeaderComponent={() => (
                    <React.Fragment>{props.children}</React.Fragment>
                )}
                ListEmptyComponent={() => (
                    <View alignSelf={"center"}>
                        <RegularText style={{
                            color: colorsVerifyCode.failLighter,
                        }}>
                            This Ghillie has been archived.
                        </RegularText>
                    </View>
                )}
            />

        )
    }

    if (!isVerified) {
        return (
            <FlatList
                {...props}
                data={[]}
                ListHeaderComponent={() => (
                    <React.Fragment>{props.children}</React.Fragment>
                )}
                ListEmptyComponent={() => (
                    <View alignSelf={"center"}>
                        <RegularText style={{
                            color: colorsVerifyCode.failLighter,
                        }}>
                            You must be verify your military status to view this content.
                        </RegularText>
                        <Button
                            style={{
                                marginTop: 10,
                                marginBottom: 10,
                                borderRadius: 20,
                            }}
                            color={colorsVerifyCode.accent}
                            onPress={() => navigation.navigate("Account", {screen: "MyAccount"})}
                        >
                            <Text style={{
                                color: "white",
                                fontSize: 20
                            }}
                            >
                                Verify Military Status
                            </Text>
                        </Button>
                    </View>
                )}
            />

        )
    }

    return (
        <FlatList
            {...props}
            style={{
                flex: 1,
                marginBottom: 40,
            }}
            data={hideData ? [] : props.data}
            ListHeaderComponent={() => (
                <React.Fragment>{props.children}</React.Fragment>
            )}
        />
    );
}
