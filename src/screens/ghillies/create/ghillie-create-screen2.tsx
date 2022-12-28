import React from 'react';

import {Badge, Box, Center, FlatList, Icon, KeyboardAvoidingView, Text, View, VStack} from "native-base";
import MainContainer from "../../../components/containers/MainContainer";
import RegularText from "../../../components/texts/regular-texts";
import {colorsVerifyCode} from "../../../components/colors";
import {Button, Platform, TextInput, TouchableOpacity} from "react-native";
import ghillieValidators from "../../../shared/validators/ghillies";
import {isBadWord} from "../../../shared/validators/ghillies/create-ghillie-form.validator";


const GhillieCreateScreen2 = ({route, navigation}) => {
        const {category} = route.params;

        const [currentTopic, setCurrentTopic] = React.useState('');
        const [topics, setTopics] = React.useState<string[]>([]);
        const [topicError, setTopicError] = React.useState<string>('');

        React.useEffect(() => {
            navigation.setOptions({
                headerRight: () => (
                    <Button
                        title={"Next"}
                        onPress={() => onMoveToNextScreen()}
                        color={colorsVerifyCode.white}
                    />
                )
            });
        }, [navigation]);

        const onMoveToNextScreen = () => {
            setTopicError('');
            setCurrentTopic('');
            navigation.navigate('GhillieCreateScreen3', {category, topics});
        }

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
            if (topics.includes(topicName)) {
                setTopicError('Topic already exists');
                return;
            }
            if (ghillieValidators.isBadWord(topicName)) {
                setTopicError('Topic name cannot contain inappropriate words');
                return;
            }

            setTopicError('');
            setTopics([...topics, topicName]);
            setCurrentTopic('');
        }

        const removeTopic = (topicName: string) => {
            setTopics(topics.filter(topic => topic !== topicName));
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
                                data={topics}
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
                                    returnKeyType={"next"}
                                />
                            </View>

                        </Center>
                    </VStack>
                </KeyboardAvoidingView>
            </MainContainer>
        );
    }
;

export default GhillieCreateScreen2;
