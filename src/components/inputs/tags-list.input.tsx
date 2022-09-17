import React, {useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';


// styled components
import styled from 'styled-components/native';
import {colorsVerifyCode} from '../colors';
import {Badge, Box, HStack} from "native-base";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import SmallText from "../texts/small-text";

const {primary, secondary, tertiary, lightGray, fail, success} = colorsVerifyCode;

interface ExtraInputProps {
  isError?: boolean;
  data: Array<string>;
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
}

export type InputProps = ExtraInputProps;

const InputField = styled.TextInput`
  background-color: ${primary};
  padding: 15px;
  padding-left: 65px;
  padding-right: 55px;
  border-radius: 10px;
  font-size: 16px;
  height: 50px;
  margin-top: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
  border-color: ${secondary};
  border-width: 2px;
`;


const TagsListInput = ({isError, data, addItem, removeItem}: InputProps) => {

  const [inputBackgroundColor, setInputBackgroundColor] = useState(primary);
  const [value, setValue] = useState('');

  const customOnBlur = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setInputBackgroundColor(primary);
  };

  const customOnFocus = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setInputBackgroundColor(secondary);
  };

  return (
    <Box alignItems="center" marginBottom={15}>
      <HStack
        flexWrap={'wrap'}
        space={1}
        // justifyContent={'space-evenly'}
      >
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <Badge // bg="red.400"
              style={{
                backgroundColor: success,
                marginBottom: 10,
                width: '32%',
              }}
              rounded="full"
              zIndex={1}
              variant="solid"
              alignSelf="center"
            >
              <TouchableOpacity
                onPress={() => removeItem(item)}
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text>
                  {item}
                </Text>
                <MaterialCommunityIcons name="close" size={20} color={lightGray}/>
              </TouchableOpacity>
            </Badge>
          </React.Fragment>
        ))}
      </HStack>
      <SmallText>Tag Names</SmallText>
      <InputField
        placeholder={"Add a Tag"}
        value={value}
        onChangeText={(value) => setValue(value)}
        style={{backgroundColor: inputBackgroundColor, borderColor: isError ? fail : secondary}}
        onBlur={customOnBlur}
        onFocus={customOnFocus}
        onSubmitEditing={() => {
          addItem(value);
          setValue('')
        }}
        keyboardType="default"
        returnKeyType="done"
      />
    </Box>
  );
};

export default TagsListInput;
