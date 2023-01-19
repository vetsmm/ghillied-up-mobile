import React, {useState} from "react";
import MainContainer from "../../../components/containers/MainContainer";
import {CommentDetailDto} from "../../../shared/models/comments/comment-detail.dto";
import {PostDetailDto} from "../../../shared/models/posts/post-detail.dto";
import {useNavigation} from "@react-navigation/native";
import {VStack} from "native-base";
import {Formik} from "formik";
import MsgBox from "../../../components/texts/message-box";
import StyledTextFieldInput from "../../../components/inputs/styled-text-field-input";
import RegularButton from "../../../components/buttons/regular-button";
import {ActivityIndicator} from "react-native";
import KeyboardAvoidingContainer from "../../../components/containers/KeyboardAvoidingContainer";
import {colorsVerifyCode} from "../../../components/colors";
import PostSharedElementNoActions from "../../../components/post-shared-element-no-actions";
import commentService from "../../../shared/services/comment.service";
import {ValidationSchemas} from "../../../shared/validators";
import {FlashMessageRef} from "../../../components/flash-message/index";
const {primary} = colorsVerifyCode;


interface Route {
  params: {
    post: PostDetailDto;
    comment: CommentDetailDto;
  };
}

export const PostCommentUpdateScreen: React.FC<{ route: Route }> = ({route}) => {
  const {params} = {...route};
  const {post, comment} = {...params};

  const [message, setMessage] = useState<string | null>('');

  const navigation: any = useNavigation();

  const handleUpdate = async (formData, setSubmitting) => {
    setMessage(null);

    commentService.updateParentComment(comment.id, {
      content: formData.content
    })
      .then(() => {
        FlashMessageRef.current?.showMessage({
          message: 'Comment Updated',
          type: 'success',
          style: {
            justifyContent: 'center',
            alignItems: 'center',
          }
        });
        setSubmitting(false);
        navigation.goBack();
      })
      .catch(error => {
        setMessage(error.data.error.message);
        FlashMessageRef.current?.showMessage({
          message: error.data.error.message || 'Something went wrong',
          type: 'danger',
          style: {
            justifyContent: 'center',
            alignItems: 'center',
          }
        });
        setSubmitting(false);
      })
  }

  const _validateForm = (formData) => {
    try {
      ValidationSchemas.UpdateCommentFormSchema
          .validateSync(formData, {abortEarly: false});
      return {};
    } catch (e: any) {
      let errors = {};
      e.inner.reduce((acc, curr) => {
        if (curr.message) {
          errors[curr.path] = curr.message;
        }
      }, {});

      return errors;
    }
  }

  return (
    <MainContainer>
      <KeyboardAvoidingContainer
        enableScroll={false}
      >
        <PostSharedElementNoActions post={post} />
        <VStack style={{margin: 25, marginBottom: 100}}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              content: comment.content,
            }}
            validate={_validateForm}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, {setSubmitting}) => {
              handleUpdate(values, setSubmitting);
            }}
          >
            {({
                handleChange,
                errors,
                handleBlur,
                handleSubmit,
                values,
                isSubmitting
              }) => (
              <>
                <StyledTextFieldInput
                  label="Edit Comment"
                  icon="email-variant"
                  placeholder="How do I use my GI Bill?"
                  numberOfLines={10}
                  keyboardType="default"
                  onChangeText={handleChange('content')}
                  onBlur={handleBlur('content')}
                  value={values.content}
                  style={{marginBottom: 15, height: 300}}
                  isError={errors.content !== undefined}
                />

                {errors.content && (
                    <MsgBox success={false} style={{marginBottom: 5}}>
                      {errors.content}
                    </MsgBox>
                )}

                {message && (
                    <MsgBox success={false} style={{marginBottom: 10}}>
                      {message}
                    </MsgBox>
                )}

                {!isSubmitting && (
                  <RegularButton
                    onPress={handleSubmit}
                  >
                    Update
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

export default PostCommentUpdateScreen;
