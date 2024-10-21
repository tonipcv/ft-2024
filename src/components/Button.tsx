import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

const Button: React.FC<ButtonProps> = ({ title, disabled, ...props }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabledButton]} 
      disabled={disabled} 
      {...props}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Button;
