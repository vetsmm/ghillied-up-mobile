import React from 'react';

import {Center, FlatList, VStack} from "native-base";
import MainContainer from "../../../components/containers/MainContainer";
import RegularText from "../../../components/texts/regular-texts";
import {useNavigation} from "@react-navigation/core";
import {GhillieCategory} from "../../../shared/models/ghillies/ghillie-category";
import GhillieCategoryCircle from "../../../components/ghillie-category-circle";
import {colorsVerifyCode} from "../../../components/colors";


const GhillieCreateScreen1 = () => {

        const navigation: any = useNavigation();

        const onSelectGhillieCategory = (category: GhillieCategory) => {
            navigation.navigate('GhillieCreateScreen2', {category});
        }

        return (
            <MainContainer>
                <VStack style={{margin: 25, marginBottom: 100}}>
                    <Center>
                        <RegularText
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: colorsVerifyCode.white,
                                marginBottom: 20
                            }}
                        >
                            Select the type of Ghillie this will be
                        </RegularText>

                        <FlatList
                            data={Object.keys(GhillieCategory)}
                            renderItem={({item}) =>
                                <GhillieCategoryCircle
                                    category={GhillieCategory[item]}
                                    onPress={() => onSelectGhillieCategory(GhillieCategory[item])}
                                    height={100}
                                    width={100}
                                />
                            }
                            keyExtractor={(item) => item}
                            numColumns={2}
                            columnWrapperStyle={{
                                justifyContent: "space-around",
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    </Center>
                </VStack>
            </MainContainer>
        );
    }
;

export default GhillieCreateScreen1;
