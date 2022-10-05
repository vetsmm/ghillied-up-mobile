import React from "react";
import {HStack, View} from "native-base";
import {GhillieCircle} from "../ghillie-circle";
import {GhillieDetailDto} from "../../shared/models/ghillies/ghillie-detail.dto";

export const GhillieHorizontalList = ({onGhilliePress, ghillieList, height, width}: {
    onGhilliePress: (ghillieId?: string) => void;
    ghillieList: GhillieDetailDto[];
    height: number;
    width: number;
}) => {
    return (
        <View style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
        }}>
            {ghillieList.map((ghillie, index) => {
                return (
                    <GhillieCircle
                        key={index}
                        onPress={onGhilliePress}
                        image={ghillie.imageUrl}
                        text={ghillie.name}
                        ghillieId={ghillie.id}
                        height={height}
                        width={width}
                    />
                );
            })}
        </View>
    )
}
