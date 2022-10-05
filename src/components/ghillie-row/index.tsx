import React from "react";
import {ScrollView, HStack} from "native-base";
import {GhillieDetailDto} from "../../shared/models/ghillies/ghillie-detail.dto";
import {GhillieCircle} from "../ghillie-circle";
import {TouchableWithoutFeedback} from "react-native";

export interface IGhillieRowProps {
    ghillieList: Array<GhillieDetailDto>;
    onPress: (ghillie: GhillieDetailDto) => void;
    enableScroll?: boolean;
    setOuterScrollViewScrollEnabled?: (enabled: boolean) => void;
}

export const GhillieRow = ({onPress, setOuterScrollViewScrollEnabled, ghillieList, enableScroll = true}: IGhillieRowProps) => {
    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={enableScroll}>
            <TouchableWithoutFeedback
                onPressIn={() => setOuterScrollViewScrollEnabled ? setOuterScrollViewScrollEnabled(false) : null}
                onPressOut={() => setOuterScrollViewScrollEnabled ? setOuterScrollViewScrollEnabled(true) : null}
            >
                <HStack width="100%" py={{base: 3, md: 4}}>
                    {ghillieList.map((ghillie, index) => (
                        <GhillieCircle
                            key={index}
                            image={ghillie.imageUrl}
                            onPress={() => onPress(ghillie)}
                            text={ghillie.name}
                        />
                    ))}
                </HStack>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default GhillieRow;
