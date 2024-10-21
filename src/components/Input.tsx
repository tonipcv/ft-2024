import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

export interface InputProps extends TextInputProps {
  // Você pode adicionar props personalizadas aqui, se necessário
}

const Input: React.FC<InputProps> = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Input;
