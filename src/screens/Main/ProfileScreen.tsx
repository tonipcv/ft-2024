import React from 'react';
import { View, Text, Button } from 'react-native';

const ProfileScreen: React.FC = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text>Perfil do Usuário</Text>
      <Button title="Editar Perfil" onPress={() => { /* Lógica para edição */ }} />
    </View>
  );
};

export default ProfileScreen;
