import React, {useCallback, useState} from 'react';

import {Formik} from 'formik';
import {ActivityIndicator, TouchableOpacity} from 'react-native';

// custom components
import {Avatar, Center, Hidden, HStack, Text, VStack} from "native-base";
import {colorsVerifyCode} from "../../../components/colors";
import MainContainer from "../../../components/containers/MainContainer";
import KeyboardAvoidingContainer from "../../../components/containers/KeyboardAvoidingContainer";
import MsgBox from "../../../components/texts/message-box";
import RegularButton from "../../../components/buttons/regular-button";
import StyledTextFieldInput from "../../../components/inputs/styled-text-field-input";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import {GhillieDetailDto} from "../../../shared/models/ghillies/ghillie-detail.dto";
import MessageModal from "../../../components/modals/message-modal";
import {useNavigation} from "@react-navigation/native";
import PostService from "../../../shared/services/post.service";
import postErrorHandler from "../../../shared/handlers/errors/post-error.handler";
import {UpdatePostInputDto} from "../../../shared/models/posts/update-post-input.dto";
import RegularText from "../../../components/texts/regular-texts";
import {PostFeedDto} from "../../../shared/models/feed/post-feed.dto";
import {PostListingDto} from "../../../shared/models/posts/post-listing.dto";
import {PostDetailDto} from "../../../shared/models/posts/post-detail.dto";
import {Ionicons} from "@expo/vector-icons";


const {primary} = colorsVerifyCode;

interface Route {
    params: {
        post: PostFeedDto | PostListingDto | PostDetailDto;
        ghillieImageUrl: string;
    };
}
function MobileHeader() {
    const navigation: any = useNavigation();

    const goBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <Hidden from="md">
            <VStack px="4" mt="4" mb="5" space="9">
                <HStack space="2" alignItems="center">
                    <TouchableOpacity style={{
                        // position: 'absolute',
                        // left: 30,
                        zIndex: 9,
                    }} onPress={goBack}>
                        <Ionicons name="arrow-back-circle-outline" size={40} color={colorsVerifyCode.secondary}/>
                    </TouchableOpacity>
                    <Center>
                        <Text
                            fontSize="3xl"
                            fontWeight="bold"
                            _light={{color: 'white'}}
                            _dark={{color: 'white'}}
                        >
                            Update Post
                        </Text>
                    </Center>
                </HStack>
            </VStack>
        </Hidden>
    );
}


export const UpdatePostScreen: React.FC<{ route: Route }> = ({route}) =>{
    // eslint-disable-next-line no-unsafe-optional-chaining
    const {params} = {...route};
    const {post, ghillieImageUrl} = {...params};

    const [message, setMessage] = useState<string | null>('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);
    const [outerScrollViewScrollEnabled, setOuterScrollViewScrollEnabled] = useState(true);

    // modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessageType, setModalMessageType] = useState('');
    const [headerText, setHeaderText] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [buttonText, setButtonText] = useState('');

    const navigation: any = useNavigation();

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    const ghillieList = useSelector(
        (state: IRootState) => state.ghillie.usersGhillieList,
    ) as Array<GhillieDetailDto>;

    type FormErrors = {
        content: string | null;
    }
    const [formErrors, setFormErrors] = useState<FormErrors>({
        content: null,
    });

    const buttonHandler = () => {
        setModalVisible(false);
    };

    const showModal = (type: any, headerText: any, message: any, buttonText: any) => {
        setModalMessageType(type);
        setHeaderText(headerText);
        setModalMessage(message);
        setButtonText(buttonText);
        setModalVisible(true);
    };

    const handleUpdate = (formData, setSubmitting) => {
        setMessage(null);

        const updatePostInput = {
            content: formData.content,
        } as UpdatePostInputDto;

        PostService.updatePost(post.id, updatePostInput)
            .then((res) => {
                setIsSuccessMessage(true);
                setSubmitting(false);
                moveTo('PostDetail', {postId: post.id});
            })
            .catch(error => {
                const errorContext = postErrorHandler.handleUpdatePostError(error.data.error);
                setFormErrors(errorContext);
                setIsSuccessMessage(false);
                setSubmitting(false);
                setMessage(error.data.error.message);
            });
    }

    const _isFormValid = (formData): boolean => {
        setMessage(null);

        if (formData.content.length === 0) {
            setFormErrors({content: "Content is required"})
            return false;
        }
        if (formData.content.length > 450) {
            setFormErrors({content: "Content is too long, max 450 characters"})
            return false;
        }

        return true;
    }

    return (
        <MainContainer>
            <KeyboardAvoidingContainer
                enableScroll={outerScrollViewScrollEnabled}
            >
                <MobileHeader/>
                <VStack style={{margin: 25, marginBottom: 100}}>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            content: post.content || '',
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            if (_isFormValid(values)) {
                                handleUpdate(values, setSubmitting);
                            } else {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              values,
                              isSubmitting
                          }) => (
                            <>
                                <Center>
                                    <Avatar
                                        borderWidth="1"
                                        _light={{borderColor: "primary.900"}}
                                        _dark={{borderColor: "primary.700"}}
                                        source={
                                            ghillieImageUrl
                                                ? {uri: ghillieImageUrl}
                                                : require("../../../../assets/logos/icon.png")
                                        }
                                        width="20"
                                        height="20"
                                    />
                                </Center>

                                <RegularText style={{
                                    marginTop:10,
                                    marginBottom: 5,
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    alignSelf: "center",
                                }}>
                                    {post.title}
                                </RegularText>


                                <StyledTextFieldInput
                                    label="Update Post"
                                    icon="email-variant"
                                    placeholder="What's on your mind?"
                                    numberOfLines={15}
                                    keyboardType="default"
                                    onChangeText={handleChange('content')}
                                    onBlur={handleBlur('content')}
                                    value={values.content}
                                    style={{marginBottom: 15, height: 200}}
                                    isError={formErrors.content !== null}
                                />

                                <MsgBox success={isSuccessMessage} style={{marginBottom: 5}}>
                                    {formErrors.content || ' '}
                                </MsgBox>

                                <MsgBox success={isSuccessMessage} style={{marginBottom: 10}}>
                                    {message || ' '}
                                </MsgBox>

                                {!isSubmitting && (
                                    <RegularButton
                                        disabled={ghillieList.length === 0}
                                        onPress={handleSubmit}
                                    >
                                        Update Post
                                    </RegularButton>
                                )}
                                {isSubmitting && (
                                    <RegularButton disabled={true}>
                                        <ActivityIndicator size="small" color={primary}/>
                                    </RegularButton>
                                )}
                            </>
                        )}
                    </Formik>
                </VStack>
            </KeyboardAvoidingContainer>
            <MessageModal
                modalVisible={modalVisible}
                buttonHandler={buttonHandler}
                type={modalMessageType}
                headerText={headerText}
                message={modalMessage}
                buttonText={buttonText}
            />
        </MainContainer>
    );
};

export default UpdatePostScreen;
