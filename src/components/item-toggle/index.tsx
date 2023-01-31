import {Spinner, Switch, Text, View} from "native-base";
import React from "react";
import {colorsVerifyCode} from "../colors";
import {StyleSheet} from "react-native";

const ItemToggle = ({title, value, onValueChange, isLoading, isDisabled = false}) => {
    return (
        <View style={styles.sectionItem}>
            <Text style={styles.sectionButtonText}>{title}</Text>
            {isLoading ? (
                <Spinner color={colorsVerifyCode.secondary}/>
            ) : (
                <Switch size="lg" onToggle={onValueChange} value={value} isDisabled={isDisabled}/>
            )}
        </View>
    );
}

export default ItemToggle;

const styles = StyleSheet.create({
    sectionItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
        marginLeft: 16,
        marginRight: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colorsVerifyCode.secondary,
    },
    sectionButtonText: {
        fontSize: 12,
        fontWeight: "bold",
        color: colorsVerifyCode.secondary
    }
});
