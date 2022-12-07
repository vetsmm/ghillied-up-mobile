import React, {useCallback, useEffect, useState} from 'react';

import {Formik} from 'formik';
import {ActivityIndicator, TouchableOpacity} from 'react-native';

import {Center, Hidden, HStack, Text, VStack} from "native-base";
import {colorsVerifyCode} from "../../../components/colors";
import ghillieValidators from "../../../shared/validators/ghillies";
import {CreateGhillieFormValidationResponse} from "../../../shared/validators/ghillies/create-ghillie-form.validator";
import MainContainer from "../../../components/containers/MainContainer";
import KeyboardAvoidingContainer from "../../../components/containers/KeyboardAvoidingContainer";
import StyledTextInput from "../../../components/inputs/styled-text-input";
import MsgBox from "../../../components/texts/message-box";
import RegularButton from "../../../components/buttons/regular-button";
import StyledTextFieldInput from "../../../components/inputs/styled-text-field-input";
import StyledCheckboxInput from "../../../components/inputs/styled-checkbox-input";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../store";
import TopicListInput from "../../../components/inputs/topic-list.input";
import GhillieService from "../../../shared/services/ghillie.service";
import ghillieErrorHandler from "../../../shared/handlers/errors/ghillie-error.handler";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {getGhillie, updateGhillie} from "../../../shared/reducers/ghillie.reducer";
import {GhillieDetailDto} from "../../../shared/models/ghillies/ghillie-detail.dto";
import MessageModal from "../../../components/modals/message-modal";
import ImageUploader from '../../../components/upload/image-upload';
import {ImageInfo} from 'expo-image-picker';
import {UpdateGhillieDto} from '../../../shared/models/ghillies/update-ghillie.dto';


const {primary, secondary} = colorsVerifyCode;

interface Route {
  params: {
    ghillie: GhillieDetailDto;
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
            zIndex: 9
          }} onPress={goBack}>
            <Ionicons name="arrow-back-circle-outline" size={40} color={secondary}/>
          </TouchableOpacity>
          <Center>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              _light={{color: 'white'}}
              _dark={{color: 'white'}}
            >
              Update Ghillie
            </Text>
          </Center>
        </HStack>
      </VStack>
    </Hidden>
  );
}


export const GhillieUpdateScreen: React.FC<{ route: Route }> = ({route}) => {
    const {ghillie} = route.params;
    
    const [message, setMessage] = useState<string | null>('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);
    
    // modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessageType, setModalMessageType] = useState('');
    const [headerText, setHeaderText] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [buttonText, setButtonText] = useState('');
    
    const dispatch = useAppDispatch();
    
    const isAdmin = useSelector(
      (state: IRootState) => state.authentication.isAdmin
    );
    
    useEffect(() => {
      dispatch(getGhillie(ghillie.id));
    }, [dispatch, ghillie]);
    
    type FormErrors = {
      name: string | null;
      about: string | null;
      readOnly: boolean | null;
      ghillieLogo: string | null;
      topicNames: string | null;
    }
    const [formErrors, setFormErrors] = useState<FormErrors>({
      name: null,
      about: null,
      readOnly: null,
      ghillieLogo: null,
      topicNames: null
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
    
    const handleUpdate = async (form, setSubmitting) => {
      setMessage(null);
      
      const nonFormData = {
        name: form.name,
        about: form.about,
        readOnly: form.readOnly,
        topicNames: form.topicNames
      } as UpdateGhillieDto;
      
      let hasError = false;
      
      GhillieService.updateGhillie(ghillie.id, nonFormData)
        .then((res) => {
          dispatch(updateGhillie(res.data));
        })
        .catch(error => {
          hasError = true;
          setIsSuccessMessage(false);
          setMessage(error?.data?.error?.message || 'Something went wrong while updating ghillie, please try again later.');
          if (error?.data?.error) {
            const errorContext = ghillieErrorHandler.handleCreateGhillieError(error.data.error);
            setFormErrors(errorContext);
          }
        });
      
      if (form.ghillieLogo) {
        GhillieService.updateGhillieImage(ghillie.id, form.ghillieLogo)
          .then((res) => {
            setIsSuccessMessage(true);
            showModal('success', 'Success', 'Ghillie updated successfully', 'OK');
            dispatch(updateGhillie(res));
          })
          .catch(error => {
            setIsSuccessMessage(false);
            setMessage(error?.data?.error?.message || 'Something went wrong while updating logo, please try again later.');
            if (error?.data?.error) {
              const errorContext = ghillieErrorHandler.handleCreateGhillieError(error.data.error);
              setFormErrors({
                ...formErrors,
                ghillieLogo: errorContext.ghillieLogo
              });
            }
          });
      } else {
        if (!hasError) {
          setIsSuccessMessage(true);
          showModal('success', 'Success', 'Ghillie updated successfully', 'OK');
        }
      }
      
      setSubmitting(false);
    }
    
    const _isFormInvalid = (formData): boolean => {
      setMessage(null);
      
      const errors: CreateGhillieFormValidationResponse = ghillieValidators.createGhillieFormValidator(formData);
      
      if (ghillie.imageUrl && !formData.ghillieLogo) {
        errors.ghillieLogo = null;
      }
      
      setFormErrors({
        name: errors.name,
        about: errors.about,
        topicNames: errors.topicNames,
        ghillieLogo: errors.ghillieLogo,
        readOnly: null
      });
      
      console.log('errors', errors);
      return Object.values(errors).some(error => error !== null);
    }
    
    return (
      <MainContainer>
        <KeyboardAvoidingContainer>
          <MobileHeader/>
          <VStack style={{margin: 25, marginBottom: 100}}>
            <Formik
              initialValues={{
                name: ghillie.name || '',
                about: ghillie.about || '',
                topicNames: ghillie.topics.map(topic => topic.name) || [] as string[],
                readOnly: ghillie.readOnly || false,
                ghillieLogo: null as unknown as ImageInfo
              }}
              onSubmit={(values, {setSubmitting}) => {
                if (!_isFormInvalid(values)) {
                  handleUpdate(values, setSubmitting);
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
                  <ImageUploader
                    setImage={(image) => setFieldValue('ghillieLogo', image)}
                    imageUri={values?.ghillieLogo?.uri ?? ghillie.imageUrl}
                  />
                  
                  <MsgBox success={isSuccessMessage} style={{marginBottom: 5}}>
                    {formErrors.ghillieLogo || ' '}
                  </MsgBox>
                  
                  <StyledTextInput
                    label="Ghillie Name"
                    icon="account-outline"
                    placeholder="US Marine Corps"
                    keyboardType="default"
                    onBlur={handleBlur('name')}
                    onChangeText={handleChange('name')}
                    value={values.name}
                    style={{marginBottom: 15}}
                    isError={formErrors.name !== null}
                  />
                  
                  <MsgBox success={isSuccessMessage} style={{marginBottom: 5}}>
                    {formErrors.name || ''}
                  </MsgBox>
                  
                  <StyledTextFieldInput
                    label="About"
                    icon="email-variant"
                    placeholder="Write some details about your Ghillie"
                    keyboardType="default"
                    onChangeText={handleChange('about')}
                    onBlur={handleBlur('about')}
                    value={values.about}
                    style={{marginBottom: 15}}
                    isError={formErrors.about !== null}
                  />
                  
                  <MsgBox success={isSuccessMessage} style={{marginBottom: 5}}>
                    {formErrors.about || ' '}
                  </MsgBox>
                  
                  <TopicListInput
                    addItem={(topicName) => {
                      // ensure topic name is not already in the list
                      if (values.topicNames.indexOf(topicName) === -1) {
                        if (topicName.length < 2 || topicName.length > 10) {
                          setIsSuccessMessage(false);
                          setFormErrors({
                            ...formErrors,
                            topicNames: 'Topic name must be between 2 and 10 characters'
                          });
                        } else {
                          setIsSuccessMessage(true);
                          setFieldValue('topicNames', [...values.topicNames, topicName]);
                          setFormErrors({
                            ...formErrors,
                            topicNames: null
                          });
                        }
                      }
                    }}
                    removeItem={(topicName) => {
                      setFieldValue('topicNames', values.topicNames.filter(name => name !== topicName));
                    }
                    }
                    data={values.topicNames}
                  />
                  
                  <MsgBox success={isSuccessMessage} style={{marginBottom: 5}}>
                    {formErrors.topicNames || ' '}
                  </MsgBox>
                  
                  {isAdmin && (
                    <>
                      <StyledCheckboxInput
                        label="Is Read Only"
                        onValueChange={(value) => setFieldValue('readOnly', value)}
                        value={values.readOnly}
                        style={{marginBottom: 15}}
                        isError={false}
                      />
                      
                      <MsgBox style={{marginBottom: 5}} success={isSuccessMessage}>
                        {message || ' '}
                      </MsgBox>
                    </>
                  )}
                  
                  {!isSubmitting && <RegularButton onPress={handleSubmit}>Update</RegularButton>}
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
  }
;

export default GhillieUpdateScreen;
