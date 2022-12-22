import React from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Text, View} from 'native-base';
import {ImagePickerResult} from 'expo-image-picker';
import {AntDesign} from '@expo/vector-icons';
import {colorsVerifyCode} from '../../colors';

export interface ImageUploadProps {
  imageUri: string | null | undefined;
  setImage: (image: ImagePickerResult) => void;
}

export const ImageUploader: React.FC<ImageUploadProps> = ({setImage, imageUri}) => {
  
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    
    if (!result.canceled) {
      setImage(result);
    }
  };
  
  return (
    <View style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={imageUploaderStyles.container}>
        {
          imageUri  && <Image source={{uri: imageUri}} style={{ width: 200, height: 200 }} />
        }
        <View style={imageUploaderStyles.uploadBtnContainer}>
          <TouchableOpacity onPress={pickImage} style={imageUploaderStyles.uploadBtn} >
            <Text style={imageUploaderStyles.text}>{imageUri ? 'Edit' : 'Upload'} Image</Text>
            <AntDesign name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ImageUploader;
const imageUploaderStyles = StyleSheet.create({
  container:{
    flex: 1,
    elevation:2,
    height:150,
    width:150,
    backgroundColor:'#efefef',
    position:'relative',
    borderRadius:999,
    overflow:'hidden',
    justifyContent:'center',
    alignItems:'center',
  },
  uploadBtnContainer:{
    opacity:0.7,
    position:'absolute',
    right:0,
    bottom:0,
    backgroundColor: colorsVerifyCode.accent,
    width:'100%',
    height:'35%',
  },
  uploadBtn:{
    display:'flex',
    alignItems:"center",
    justifyContent:'center'
  },
  text:{
    fontSize:12,
    color: colorsVerifyCode.white
  }
})
