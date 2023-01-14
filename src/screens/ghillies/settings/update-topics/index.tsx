import React from 'react';

import {Badge, Center, FlatList, KeyboardAvoidingView, View, VStack} from "native-base";
import {ActivityIndicator, Platform, TextInput, TouchableOpacity} from "react-native";
import {colorsVerifyCode} from "../../../../components/colors";
import ghillieValidators from "../../../../shared/validators/ghillies";
import MainContainer from "../../../../components/containers/MainContainer";
import RegularText from "../../../../components/texts/regular-texts";
import {IRootState, useAppDispatch} from "../../../../store";
import {useSelector} from "react-redux";
import GhillieService from "../../../../shared/services/ghillie.service";
import {updateGhillie} from "../../../../shared/reducers/ghillie.reducer";
import {FlashMessageRef} from "../../../../components/flash-message/index";


const UpdateGhillieTopicsScreen = () => {
        const dispatch = useAppDispatch();

        const ghillie = useSelector(
            (state: IRootState) => state.ghillie.ghillie
        );

        const [currentTopic, setCurrentTopic] = React.useState('');
        const [topicNames, setTopicNames] = React.useState<string[]>([]);
        const [topicError, setTopicError] = React.useState<string>('');
        const [isLoading, setIsLoading] = React.useState(false);

        React.useEffect(() => {
            setTopicNames(ghillie.topics.map(topic => topic.name));
        }, [ghillie]);

        const addTopic = (topicName: string) => {
            // Validate Topic Name
            if (topicName.length < 2) {
                setTopicError('Topic name must be at least 2 characters');
                return;
            }
            if (topicName.length > 10) {
                setTopicError('Topic name must be less than 10 characters');
                return;
            }
            if (topicNames.includes(topicName)) {
                setTopicError('Topic already exists');
                return;
            }
            if (ghillieValidators.isBadWord(topicName)) {
                setTopicError('Topic name cannot contain inappropriate words');
                return;
            }

            setTopicError('');
            setIsLoading(true);
            GhillieService.addTopicsToGhillie(ghillie.id, [topicName])
                .then((res) => {
                    dispatch(updateGhillie(res));
                    setCurrentTopic('');
                    setIsLoading(false);
                    FlashMessageRef.current?.showMessage({
                        message: 'Topics added',
                        type: 'success',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                })
                .catch( () => {
                    setIsLoading(false);
                    FlashMessageRef.current?.showMessage({
                        message: 'Error adding topic, please try again',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                });
        }

        const removeTopic = (topicName: string) => {
            setIsLoading(true);
            GhillieService.removeTopicsFromGhillies(ghillie.id, [topicName])
                .then((res) => {
                    dispatch(updateGhillie(res));
                    setIsLoading(false);
                    FlashMessageRef.current?.showMessage({
                        message: 'Topic removed',
                        type: 'success',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                })
                .catch( () => {
                    setIsLoading(false);
                    FlashMessageRef.current?.showMessage({
                        message: 'Error removing topics, please try again',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                });
        }

        return (
            <MainContainer>
                <KeyboardAvoidingView
                    style={{flex: 1, backgroundColor: 'transparent'}}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={60}
                >
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
                                What types of topics will this Ghillie cover?
                            </RegularText>

                            <FlatList
                                data={topicNames}
                                renderItem={({item}) =>
                                    <TouchableOpacity
                                        style={{
                                            margin: "5%"
                                        }}
                                        onPress={() => removeTopic(item)}
                                    >
                                        <Badge
                                            variant="outline"
                                            style={{
                                                borderColor: colorsVerifyCode.secondary,
                                                borderWidth: 1,
                                                borderRadius: 10,
                                            }}
                                            _text={{
                                                color: colorsVerifyCode.white,
                                                fontSize: 15,
                                            }}
                                        >
                                            {item}
                                        </Badge>
                                    </TouchableOpacity>
                                }
                                mb={"10%"}
                                keyExtractor={(item) => item}
                                numColumns={3}
                                columnWrapperStyle={{
                                    justifyContent: "space-around",
                                }}
                                showsVerticalScrollIndicator={false}
                                ListEmptyComponent={
                                    <RegularText>
                                        No topics added yet
                                    </RegularText>
                                }
                            />

                            <RegularText
                                style={{
                                    color: colorsVerifyCode.fail,
                                    marginBottom: 10,
                                    fontSize: 16
                                }}
                            >
                                {topicError}
                            </RegularText>

                            <View
                                style={{
                                    width: "100%",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    alignContent: 'center',
                                }}
                            >
                                {isLoading
                                    ? (
                                        <Center>
                                            <ActivityIndicator size="large" color={colorsVerifyCode.secondary}/>
                                        </Center>
                                    )
                                    : (
                                        <TextInput
                                            placeholder="Create a topic (ex. 401k)"
                                            keyboardType="default"
                                            textAlign={"center"}
                                            style={{
                                                marginBottom: 25,
                                                width: "100%",
                                                backgroundColor: colorsVerifyCode.primary,
                                                borderRadius: 10,
                                                fontSize: 16,
                                                height: 60,
                                                marginTop: 3,
                                                color: colorsVerifyCode.tertiary,
                                                borderColor: colorsVerifyCode.secondary,
                                                borderBottomWidth: 2,
                                            }}
                                            value={currentTopic}
                                            onChangeText={(text) => setCurrentTopic(text)}
                                            onSubmitEditing={(e) => addTopic(e.nativeEvent.text)}
                                            autoFocus={true}
                                            blurOnSubmit={false}
                                            clearButtonMode="while-editing"
                                            returnKeyLabel={"Add"}
                                            returnKeyType={"send"}
                                        />
                                    )}
                            </View>

                        </Center>
                    </VStack>
                </KeyboardAvoidingView>
            </MainContainer>
        );
    }
;

export default UpdateGhillieTopicsScreen;
