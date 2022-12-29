import React from 'react';

import {Center, FlatList, View} from "native-base";
import {GhillieCategory} from "../../../../shared/models/ghillies/ghillie-category";
import MainContainer from '../../../../components/containers/MainContainer';
import RegularText from '../../../../components/texts/regular-texts';
import {colorsVerifyCode} from "../../../../components/colors";
import GhillieCategoryCircle from "../../../../components/ghillie-category-circle";
import GhillieService from "../../../../shared/services/ghillie.service";
import {ActivityIndicator} from "react-native";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../../store";
import {updateGhillie} from "../../../../shared/reducers/ghillie.reducer";
import {FlashMessageRef} from "../../../../app/App";


const UpdateGhillieCategoryScreen: React.FC = () => {

        const dispatch = useAppDispatch();

        const ghillie = useSelector(
            (state: IRootState) => state.ghillie.ghillie
        );

        const [currentCategory, setCurrentCategory] = React.useState<GhillieCategory>(ghillie.category);
        const [isLoading, setIsLoading] = React.useState(false);

        React.useEffect(() => {
            setCurrentCategory(ghillie.category);
        }, [ghillie]);

        const onSelectGhillieCategory = (category: GhillieCategory) => {
            setIsLoading(true);
            GhillieService.updateGhillie(ghillie.id, {category})
                .then((res) => {
                    dispatch(updateGhillie(res.data));
                    setIsLoading(false);
                    FlashMessageRef.current?.showMessage({
                        message: 'Category updated successfully',
                        type: 'success',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                })
                .catch(error => {
                    setIsLoading(false);
                    FlashMessageRef.current?.showMessage({
                        message: 'Error updating category, please try again',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                });
        }

        const _renderHeader = () => (
            <Center>
                <RegularText
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: colorsVerifyCode.white,
                        marginBottom: 20
                    }}
                >
                    Current category
                </RegularText>
                <GhillieCategoryCircle
                    category={currentCategory}
                    height={50}
                    width={50}
                    onPress={() => undefined}
                />

                <RegularText
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: colorsVerifyCode.white,
                        marginBottom: 20,
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    Select the type of category to set for this Ghillie
                </RegularText>
            </Center>
        );

        return (
            <MainContainer>
                <View style={{margin: 25, marginBottom: 100}}>
                    <Center>
                        {isLoading ? (
                            <>
                                {_renderHeader()}
                                <ActivityIndicator
                                    size="large"
                                    color={colorsVerifyCode.secondary}
                                />
                            </>
                        ) : (
                            <FlatList
                                data={Object.keys(GhillieCategory)}
                                refreshing={isLoading}
                                renderItem={({item}) =>
                                    <GhillieCategoryCircle
                                        key={item}
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
                                ListHeaderComponent={_renderHeader}
                            />
                        )}
                    </Center>
                </View>
            </MainContainer>
        );
    }
;

export default UpdateGhillieCategoryScreen;
