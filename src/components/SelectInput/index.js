import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Container } from './styles';

export default function SelectInput({ placeholder, items, onChange }) {
  const [value, setValue] = useState([]);

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      marginBottom: 10,
      borderRadius: 4,
      backgroundColor: '#ffffff',
      color: '#3d3c3c',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 12,
      marginBottom: 10,
      borderRadius: 4,
      backgroundColor: '#ffffff',
      color: '#3d3c3c',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });

  function handleChange(newValue) {
    setValue(newValue);
  }

  return (
    <Container>
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        // onValueChange={value => {
        //   if (onChange) setStatus(value);
        // }}

        onValueChange={newValue => {
          handleChange(newValue);
          if (onChange) onChange(newValue);
        }}
        style={{
          ...pickerSelectStyles,
          placeholder: {
            color: '#3d3c3c',
          },
          iconContainer: {
            top: 10,
            right: 12,
          },
        }}
        value={value}
        useNativeAndroidPickerStyle={false}
        textInputProps={{ underlineColor: 'white' }}
        Icon={() => {
          return <Icon name="chevron-down" size={24} color="#3D3C3C" />;
        }}
      />
    </Container>
  );
}
