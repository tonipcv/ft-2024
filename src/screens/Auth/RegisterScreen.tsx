import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password);
      Alert.alert(
        'Sucesso',
        'Registro realizado com sucesso! Verifique seu email para o código de confirmação.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('VerifyCodeScreen', { email, isPasswordReset: false })
          }
        ]
      );
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro no registro', error.message);
      } else {
        Alert.alert('Erro no registro', 'Ocorreu um erro ao tentar registrar. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar</Text>
      <Input 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input 
        placeholder="Senha" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      <Input 
        placeholder="Confirmar Senha" 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
        secureTextEntry 
      />
      <Button 
        title={isLoading ? "Registrando..." : "Registrar"} 
        onPress={handleRegister}
        disabled={isLoading}
      />
      <Text style={styles.infoText}>
        Ao se registrar, você será inscrito no plano gratuito.
      </Text>
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
    marginBottom: 20,
  },
  infoText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },
});

export default RegisterScreen;
