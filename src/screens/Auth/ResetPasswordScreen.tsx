import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { sendResetCode } from '../../services/api';
import { RootStackParamList } from '../../navigation/types';

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();

  const handleSendResetCode = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail.');
      return;
    }

    setIsLoading(true);
    try {
      await sendResetCode(email);
      Alert.alert('Sucesso', 'Código de redefinição enviado para o seu email.', [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('VerifyCodeScreen', { email, isPasswordReset: true })
        }
      ]);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Falha ao enviar o código de redefinição.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir Senha</Text>
      <Text style={styles.subtitle}>Insira seu e-mail para receber o código de verificação</Text>
      <Input 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button 
        title={isLoading ? "Enviando..." : "Enviar Código"} 
        onPress={handleSendResetCode}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray',
  },
});

export default ResetPasswordScreen;
