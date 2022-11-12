import React, {useState} from 'react';

import {Formik} from 'formik';
import {ActivityIndicator} from 'react-native';

// custom components
import {Center, Hidden, HStack, Image, Text, VStack} from "native-base";
import {colorsVerifyCode} from "../../../components/colors";
import MainContainer from "../../../components/containers/MainContainer";
import KeyboardAvoidingContainer from "../../../components/containers/KeyboardAvoidingContainer";
import StyledTextInput from "../../../components/inputs/styled-text-input";
import MsgBox from "../../../components/texts/message-box";
import RegularButton from "../../../components/buttons/regular-button";
import StyledTextFieldInput from "../../../components/inputs/styled-text-field-input";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../store";
import {GhillieDetailDto} from "../../../shared/models/ghillies/ghillie-detail.dto";
import MessageModal from "../../../components/modals/message-modal";
import {CreatePostInputDto} from "../../../shared/models/posts/create-post-input.dto";
import postValidators from "../../../shared/validators/posts";
import {CreatePostFormValidationResponse} from "../../../shared/validators/posts/post-form.validator";
import SmallText from "../../../components/texts/small-text";
import GhillieRow from "../../../components/ghillie-row";
import {GhillieCircle} from "../../../components/ghillie-circle";
import {getMyGhillies} from "../../../shared/reducers/ghillie.reducer";
import {useNavigation} from "@react-navigation/native";
import PostService from "../../../shared/services/post.service";
import postErrorHandler from "../../../shared/handlers/errors/post-error.handler";
import {PostStatus} from "../../../shared/models/posts/post-status";


const {primary} = colorsVerifyCode;

function MobileHeader() {
  return (
    <Hidden from="md">
      <VStack px="4" mt="4" mb="5" space="9">
        <HStack space="2" alignItems="center">
          <Center>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              _light={{color: 'white'}}
              _dark={{color: 'white'}}
            >
              Share your thoughts!
            </Text>
          </Center>
        </HStack>
      </VStack>
    </Hidden>
  );
}

interface Route {
  params: {
    preSelectedGhillie?: GhillieDetailDto;
  };
}

export const CreatePostScreen: React.FC<{ route: Route }> = ({route}) =>{
  // eslint-disable-next-line no-unsafe-optional-chaining
  const {params} = {...route};
  const {preSelectedGhillie} = {...params};

  const [message, setMessage] = useState<string | null>('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [outerScrollViewScrollEnabled, setOuterScrollViewScrollEnabled] = useState(true);

  // modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessageType, setModalMessageType] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [buttonText, setButtonText] = useState('');

  const dispatch = useAppDispatch();
  const navigation: any = useNavigation();

  const isVerifiedMilitary = useSelector(
    (state: IRootState) => state.authentication.isVerifiedMilitary,
  );

  const moveTo = (screen, payload?) => {
    navigation.navigate(screen, {...payload});
  };

  const ghillieList = useSelector(
    (state: IRootState) => state.ghillie.usersGhillieList,
  ) as Array<GhillieDetailDto>;

  React.useEffect(() => {
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return navigation.addListener('focus', () => {
      // The screen is focused
      dispatch(getMyGhillies());
    });
  }, [dispatch, navigation]);

  type FormErrors = {
    title: string | null;
    content: string | null;
    status: string | null;
    ghillieId: string | null;
  }
  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: null,
    content: null,
    status: null,
    ghillieId: null,
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

  const handleCreate = async (formData, setSubmitting) => {
    setMessage(null);

    const createPostInputDto = CreatePostInputDto.create({
      title: formData.title,
      content: formData.content,
      ghillieId: formData.ghillie.id,
      status: formData.status,
    });

    PostService.createPost(createPostInputDto)
      .then((res) => {
        setIsSuccessMessage(true);
        setSubmitting(false);
        moveTo('PostDetail', {postId: res.data.id});
      })
      .catch(error => {
        const errorContext = postErrorHandler.handleCreatePostError(error.data.error);
        setFormErrors(errorContext);
        setIsSuccessMessage(false);
        setSubmitting(false);
        setMessage(error.data.error.message);
      });
  }

  const _isFormValid = async (formData): Promise<boolean> => {
    setMessage(null);

    const errors: CreatePostFormValidationResponse = await postValidators.createPostFormValidator(
      CreatePostInputDto.create({
        title: formData.title,
        content: formData.content,
        ghillieId: formData.ghillie.id,
        status: formData.status,
      })
    );

    setFormErrors({
      title: errors.title,
      content: errors.content,
      ghillieId: errors.ghillieId,
      status: errors.status,
    });

    return !Object.values(errors).some(error => error !== null);
  }

  if (ghillieList.length === 0) {
    return (
      <MainContainer
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <VStack style={{
          margin: 25,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Image
            source={require("../../../../assets/thinking-soldier.png")}
            alt={"Thinking Soldier"}
            resizeMode="contain"
            height={400}
          />
          {isVerifiedMilitary ? (
            <RegularButton
              textStyle={{
                fontSize: 20
              }}
              onPress={() => moveTo("Account", { screen: "AccountHome" })}
            >
              Verify Military status to post!
            </RegularButton>
          ) : (
            <RegularButton
              textStyle={{
                fontSize: 20
              }}
              onPress={() => moveTo("Ghillies", {screen: "GhillieListing"})}
            >
              Join a Ghillie to Post!
            </RegularButton>
          )}

        </VStack>
      </MainContainer>
    )
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
              title: '',
              content: '',
              ghillie: preSelectedGhillie || {} as GhillieDetailDto,
              status: PostStatus.ACTIVE,
            }}
            onSubmit={async (values, {setSubmitting}) => {
              if (await _isFormValid(values)) {
                handleCreate(values, setSubmitting);
              } else {
                setSubmitting(false);
              }
            }}
          >
            {({
                handleChange,
                setFieldValue,
                handleBlur,
                handleSubmit,
                values,
                isSubmitting
              }) => (
              <>
                {Object.keys(values.ghillie).length > 0 && (
                  <Center>
                    <GhillieCircle
                      image={values.ghillie.imageUrl}
                      onPress={() => setFieldValue('ghillie', {})}
                      text={values.ghillie.name}
                    />
                  </Center>
                )}
                {Object.keys(values.ghillie).length < 1 && (
                  <>
                    <SmallText>Select a Ghillie to post to</SmallText>
                    <GhillieRow
                      ghillieList={ghillieList}
                      onPress={(selectedGhillie) => {
                        setFieldValue('ghillie', selectedGhillie);
                      }}
                      setOuterScrollViewScrollEnabled={setOuterScrollViewScrollEnabled}
                      enableScroll={outerScrollViewScrollEnabled}
                    />
                  </>
                )}

                <MsgBox success={isSuccessMessage} style={{marginBottom: 5}}>
                  {formErrors.ghillieId ? "Must select a Ghillie" : ''}
                </MsgBox>

                <StyledTextInput
                  label="Post Title"
                  icon="account-outline"
                  placeholder="So wagner did it again!"
                  keyboardType="default"
                  onBlur={handleBlur('title')}
                  onChangeText={handleChange('title')}
                  value={values.title}
                  style={{marginBottom: 15}}
                  isError={formErrors.title !== null}
                />

                <MsgBox success={isSuccessMessage} style={{marginBottom: 5}}>
                  {formErrors.title || ''}
                </MsgBox>

                <StyledTextFieldInput
                  label="Post Body"
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
                    Post
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

export default CreatePostScreen;
