import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { verifyCode, sendResetCode } from '../../services/api';
import { RootStackParamList, VerifyCodeScreenNavigationProp } from '../../navigation/types';

type VerifyCodeScreenRouteProp = RouteProp<RootStackParamList, 'VerifyCodeScreen'>;

const VerifyCodeScreen: React.FC = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<VerifyCodeScreenNavigationProp>();
  const route = useRoute<VerifyCodeScreenRouteProp>();
  const { email, isPasswordReset } = route.params;

  const handleVerify = async () => {
    if (!code) {
      Alert.alert('Erro', 'Por favor, insira o código de verificação.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyCode(email, code);
      if (isPasswordReset) {
        navigation.navigate('InsertNewPassword', { email, code });
      } else {
        navigation.navigate('SuccessScreen', { message: 'Conta verificada com sucesso!' });
      }
    } catch (error) {
      Alert.alert('Erro', 'Código inválido. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await sendResetCode(email);
      Alert.alert('Sucesso', 'Um novo código foi enviado para o seu e-mail.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível reenviar o código. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificar Código</Text>
      <Text style={styles.subtitle}>
        Um código de verificação foi enviado para {email}
      </Text>
      <Input 
        placeholder="Código" 
        value={code} 
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <Button 
        title={isLoading ? "Verificando..." : "Verificar"} 
        onPress={handleVerify}
        disabled={isLoading}
      />
      <Button 
        title="Reenviar Código" 
        onPress={handleResendCode}
        disabled={isLoading}
        style={styles.resendButton}
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
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: 'gray',
  },
  resendButton: {
    marginTop: 10,
  },
});

export default VerifyCodeScreen;
