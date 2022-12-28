import React from "react";
import {ScrollView, HStack} from "native-base";
import {TouchableWithoutFeedback} from "react-native";
import {GhillieCategory} from "../../shared/models/ghillies/ghillie-category";
import GhillieCategoryCircle from "../ghillie-category-circle";

export interface GhillieCategoryRowProps {
    onPress: (category: GhillieCategory) => void;
    enableScroll?: boolean;
    setOuterScrollViewScrollEnabled?: (enabled: boolean) => void;
}

export const GhillieCategoryRow = ({
                               onPress,
                               setOuterScrollViewScrollEnabled,
                               enableScroll = true
                           }: GhillieCategoryRowProps) => {
    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={enableScroll}>
            <TouchableWithoutFeedback
                onPressIn={() => setOuterScrollViewScrollEnabled ? setOuterScrollViewScrollEnabled(false) : null}
                onPressOut={() => setOuterScrollViewScrollEnabled ? setOuterScrollViewScrollEnabled(true) : null}
            >
                <HStack width="100%" py={{base: 3, md: 4}}>
                    {Object.keys(GhillieCategory).map((category) => (
                        <GhillieCategoryCircle
                            key={category}
                            onPress={() => onPress(GhillieCategory[category])}
                            category={GhillieCategory[category]}
                        />
                    ))}
                </HStack>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default GhillieCategoryRow;
