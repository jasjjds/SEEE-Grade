import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface MyInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: object;
  [key: string]: any; 
}

const MyInput = ({ 
  value, 
  onChangeText, 
  placeholder, 
  style, 
  ...otherProps
}: MyInputProps) => {
  return (
    <TextInput
      style={[styles.input, style]} 
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      placeholderTextColor="#999" 
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
});

export default MyInput;