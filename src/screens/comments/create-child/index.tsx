import React, {useState} from "react";
import MainContainer from "../../../components/containers/MainContainer";
import {useNavigation} from "@react-navigation/native";
import {VStack} from "native-base";
import {Formik} from "formik";
import MsgBox from "../../../components/texts/message-box";
import StyledTextFieldInput from "../../../components/inputs/styled-text-field-input";
import RegularButton from "../../../components/buttons/regular-button";
import {ActivityIndicator} from "react-native";
import KeyboardAvoidingContainer from "../../../components/containers/KeyboardAvoidingContainer";
import {colorsVerifyCode} from "../../../components/colors";
import commentService from "../../../shared/services/comment.service";
import {ParentCommentDto} from '../../../shared/models/comments/parent-comment.dto';
const {primary} = colorsVerifyCode;


interface Route {
  params: {
    parentComment: ParentCommentDto;
  };
}

export const CreateChildCommentScreen: React.FC<{ route: Route }> = ({route}) => {
  const {params} = {...route};
  const {parentComment} = {...params};

  const [message, setMessage] = useState<string | null>('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const navigation: any = useNavigation();

  type FormErrors = {
    content: string | null;
  }
  const [formErrors, setFormErrors] = useState<FormErrors>({
    content: null,
  });

  const handleCreate = async (formData, setSubmitting) => {
    setMessage(null);

    commentService.createReplyComment(formData.parentCommentId, formData.content)
      .then((response) => {
        setIsSuccessMessage(true);
        setSubmitting(false);
        navigation.goBack();
      })
      .catch(error => {
        setMessage(error.data.error.message);
        setIsSuccessMessage(false);
        setSubmitting(false);
      })
  }

  const _isFormValid = (values) => {
    if (values.content.length > 1000) {
      setFormErrors({
        content: 'Reply must be less than 1000 characters',
      });
      return false;
    }
    if (values.content.length < 3) {
      setFormErrors({
        content: 'Reply must be more than 3 characters',
      });
      return false;
    }
    return true;
  }

  return (
    <MainContainer>
      <KeyboardAvoidingContainer
        enableScroll={true}
      >
        {/* TODO add parent comment detail*/}
        <VStack style={{margin: 25, marginBottom: 100}}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              content: '',
              parentCommentId: parentComment.id,
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
                <StyledTextFieldInput
                  label="Reply to Comment"
                  icon="email-variant"
                  placeholder="How do I use my GI Bill?"
                  numberOfLines={10}
                  keyboardType="default"
                  onChangeText={handleChange('content')}
                  onBlur={handleBlur('content')}
                  value={values.content}
                  style={{marginBottom: 15, height: 300}}
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
                    onPress={handleSubmit}
                  >
                    Reply
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
    </MainContainer>
  );
}

export default CreateChildCommentScreen;