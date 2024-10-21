import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { resetPassword } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

type InsertNewPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'InsertNewPassword'>;

const InsertNewPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<InsertNewPasswordScreenNavigationProp>();
  const route = useRoute();
  const { login } = useAuth();
  
  const { email, code } = route.params as { email: string; code: string };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      // Após redefinir a senha, fazemos login automaticamente
      const { token } = await login(email, newPassword);
      // Navega para a SuccessScreen
      navigation.navigate('SuccessScreen', { message: 'Senha alterada com sucesso!' });
    } catch (error) {
      Alert.alert('Erro', 'Houve um problema ao alterar sua senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Senha</Text>
      
      <Input
        placeholder="Nova Senha"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      
      <Input
        placeholder="Confirme a Nova Senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      
      <Button
        title={isLoading ? "Criando..." : "Criar Senha"}
        onPress={handleResetPassword}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default InsertNewPassword;
