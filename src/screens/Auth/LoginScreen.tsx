import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigation.navigate('DashboardScreen' as never);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro no login', error.message);
      } else {
        Alert.alert('Erro no login', 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navegar para a tela de redefinição de senha
    navigation.navigate('ResetPasswordScreen' as never);
  };

  const handleRegister = () => {
    // Navegar para a tela de registro
    navigation.navigate('RegisterScreen' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button 
        title={isLoading ? "Carregando..." : "Entrar"} 
        onPress={handleLogin}
        disabled={isLoading}
      />
      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text>Não tem uma conta? </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerText}>Registre-se</Text>
        </TouchableOpacity>
      </View>
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
  forgotPassword: {
    marginTop: 15,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: 'blue',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: 'blue',
  },
});

export default LoginScreen;
