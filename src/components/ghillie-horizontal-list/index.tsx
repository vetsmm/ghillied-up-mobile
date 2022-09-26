import React from "react";
import {HStack} from "native-base";
import {GhillieCircle} from "../ghillie-circle";
import {GhillieDetailDto} from "../../shared/models/ghillies/ghillie-detail.dto";

export const GhillieHorizontalList = ({onGhilliePress, ghillieList, height, width}: {
    onGhilliePress: (ghillieId?: string) => void;
    ghillieList: GhillieDetailDto[];
    height: number;
    width: number;
}) => {
    return (
        <HStack>
            {ghillieList.map((ghillie, index) => {
                return (
                    <GhillieCircle
                        key={index}
                        onPress={onGhilliePress}
                        image={ghillie.imageUrl || "https://i.imgur.com/2cUgS9A.png"}
                        text={ghillie.name}
                        ghillieId={ghillie.id}
                        height={height}
                        width={width}
                    />
                );
            })}
        </HStack>
    )
}
