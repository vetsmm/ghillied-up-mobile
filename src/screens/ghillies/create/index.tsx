import React, {useState} from 'react';
import {Formik} from 'formik';
import {ActivityIndicator} from 'react-native';

import {Hidden, HStack, Text, VStack} from "native-base";
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
import {IRootState} from "../../../store";
import TopicListInput from "../../../components/inputs/topic-list.input";
import GhillieService from "../../../shared/services/ghillie.service";
import ghillieErrorHandler from "../../../shared/handlers/errors/ghillie-error.handler";
import {ImageInfo} from 'expo-image-picker';
import ImageUploader from '../../../components/upload/image-upload';
import {CreateGhillieInputDto} from '../../../shared/models/ghillies/create-ghillie-input.dto';


const {primary} = colorsVerifyCode;

function MobileHeader() {
  return (
    <Hidden from="md">
      <VStack px="4" mt="4" mb="5" space="9">
        <HStack space="2" alignItems="center">
        </HStack>
        <VStack space={0.5}>
          <Text
            fontSize="3xl"
            fontWeight="bold"
            _light={{color: 'white'}}
            _dark={{color: 'white'}}
          >
            Create a new Ghillie!
          </Text>
        </VStack>
      </VStack>
    </Hidden>
  );
}


const GhillieCreateScreen = ({navigation}) => {
    const [message, setMessage] = useState<string | null>('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);
    
    const isAdmin = useSelector(
      (state: IRootState) => state.authentication.isAdmin
    );
    
    
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
    
    const moveTo = (screen, payload?) => {
      navigation.navigate(screen, {...payload});
    };
    
    const handleCreate = async (formData, setSubmitting) => {
      setMessage(null);
      
      const nonFormData = {
        name: formData.name,
        about: formData.about,
        readOnly: formData.readOnly,
        topicNames: formData.topicNames
      } as CreateGhillieInputDto;
      
      let hasError = false;
      let ghillieId: string | null = null;
      
      await GhillieService.createGhillie(nonFormData)
        .then((res) => {
          ghillieId = res.data.id;
        })
        .catch(error => {
          setSubmitting(false);
          hasError = true;
          setIsSuccessMessage(false);
          const errorContext = ghillieErrorHandler.handleCreateGhillieError(error.data.error);
          setFormErrors(errorContext);
          if (error?.data?.error?.message) {
            setMessage(error.data.error.message || 'Something went wrong while creating ghillie, please try again later.');
          }
        });
      
      if (!hasError && ghillieId) {
        GhillieService.updateGhillieImage(ghillieId, formData.ghillieLogo)
          .then((res) => {
            setSubmitting(false);
            setIsSuccessMessage(true);
            moveTo('GhillieDetail', {ghillieId});
          })
          .catch(error => {
            setIsSuccessMessage(false);
            setMessage(error?.data?.error?.message || 'Something went wrong while creating logo, please try again later.');
            if (error?.data?.error) {
              const errorContext = ghillieErrorHandler.handleCreateGhillieError(error.data.error);
              setFormErrors({
                ...formErrors,
                ghillieLogo: errorContext.ghillieLogo
              });
            }
          });
      } else {
        setSubmitting(false);
      }
    }
    
    const _isFormInvalid = (formData): boolean => {
      setMessage(null);
      
      const errors: CreateGhillieFormValidationResponse = ghillieValidators.createGhillieFormValidator(formData);
      
      setFormErrors({
        name: errors.name,
        about: errors.about,
        ghillieLogo: errors.ghillieLogo,
        topicNames: errors.topicNames,
        readOnly: null
      });
      
      return Object.values(errors).some(error => error !== null);
    }
    
    return (
      <MainContainer>
        <KeyboardAvoidingContainer>
          <MobileHeader/>
          <VStack style={{margin: 25, marginBottom: 100}}>
            <Formik
              initialValues={{
                name: '',
                about: '',
                ghillieLogo: null as unknown as ImageInfo,
                topicNames: [] as string[],
                readOnly: false
              }}
              onSubmit={(values, {setSubmitting}) => {
                if (!_isFormInvalid(values)) {
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
                  
                  <ImageUploader
                    setImage={(image) => setFieldValue('ghillieLogo', image)}
                    imageUri={values?.ghillieLogo?.uri}
                  />
                  
                  <MsgBox success={isSuccessMessage} style={{marginBottom: 5}}>
                    {formErrors.ghillieLogo || ' '}
                  </MsgBox>
                  
                  <StyledTextInput
                    label="Ghillie Name"
                    icon="account-outline"
                    placeholder="US Marine Corps"
                    keyboardType="default"
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    style={{marginBottom: 15}}
                    isError={formErrors.name !== null}
                  />
                  
                  <MsgBox success={isSuccessMessage} style={{marginBottom: 5}}>
                    {formErrors.name && formErrors.name}
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
                  
                  {!isSubmitting && <RegularButton onPress={handleSubmit}>Create</RegularButton>}
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
      </MainContainer>
    );
  }
;

export default GhillieCreateScreen;
