import React, {useCallback, useState} from 'react';
import {TextInput, TextInputProps} from 'react-native';
import styles from './styles';
import {debounce} from 'lodash';
import {getGhillies, resetResults} from "../../shared/reducers/ghillie.reducer";
import {useAppDispatch} from "../../store";
import {colorsVerifyCode} from "../colors";
import {View} from "native-base";
import {FontAwesome5} from "@expo/vector-icons";
import styled from "styled-components/native";

const {primary, secondary} = colorsVerifyCode;

interface ExtraInputProps {
  searchText: string;
  setSearchText: (text) => void;
  placeholder?: string;
}

export type InputProps = TextInputProps & ExtraInputProps;

const LeftIcon = styled.View`
  position: absolute;
  top: 10px;
  left: 50px;
  z-index: 1;
  border-right-width: 2px;
  border-color: ${secondary};
  padding-right: 10px;
`;


export const SearchInput = ({searchText, setSearchText, placeholder = "Search for Ghillie", ...props}: InputProps) => {
  const [inputBackgroundColor, setInputBackgroundColor] = useState(primary);

  const dispatch = useAppDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchForText = useCallback(
    debounce((text: string) => {
      if (text?.trim().length > 0) {
        const name = text.trim().length > 0 ? text.trim() : undefined;
        dispatch(getGhillies({
          name,
          offset: 0,
          limit: 25,
        }));
      } else {
        dispatch(resetResults());
      }
    }, 1000),
    [setSearchText, dispatch],
  );
  const customOnBlur = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props?.onBlur;
    setInputBackgroundColor(primary);
  };

  const customOnFocus = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props?.onFocus;
    setInputBackgroundColor(secondary);
  };


  return (
    <View>
      <LeftIcon>
        <FontAwesome5 name={'search'} size={20} color={'#fff'}/>
      </LeftIcon>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={"white"}
        style={[styles.container, {
          backgroundColor: inputBackgroundColor,
        }]}
        value={searchText}
        onChangeText={(text: string) => {
          setSearchText(text);
          searchForText(text);
        }}
        maxLength={40}
        returnKeyType={'search'}
        onBlur={customOnBlur}
        onFocus={customOnFocus}
      />
    </View>
  );
};
