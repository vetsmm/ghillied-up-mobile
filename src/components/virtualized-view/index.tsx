import React from 'react';
import {Text, FlatList, View, Button} from 'native-base';
import {IFlatListProps} from "native-base/src/components/basic/FlatList/types";
import {colorsVerifyCode} from "../colors";
import RegularText from "../texts/regular-texts";
import {useNavigation} from "@react-navigation/native";

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
                            color: colorsVerifyCode.fail,
                        }}>
                            This Ghillie has been archived.
                        </RegularText>
                    </View>
                )}
            />

        )
    }

    if (!isVerified) {
        // Remove onEndReach from props, no paging here, only to preview content
        const {onEndReached, ...rest} = props;
        return (
            <>
                <FlatList
                    {...rest}
                    style={{
                        flex: 1,
                        marginBottom: 40,
                    }}
                    data={hideData ? [] : props.data}
                    ListHeaderComponent={() => (
                        <React.Fragment>{props.children}</React.Fragment>
                    )}
                    ListFooterComponent={() => (
                        <View
                            flex={1}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <RegularText style={{
                                textAlign: "center",
                                fontSize: 18,
                            }}>
                                Interested in what you see? Verify your military status to see more...
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
            </>
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
