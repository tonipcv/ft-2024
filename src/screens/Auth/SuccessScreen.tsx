import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type SuccessScreenRouteProp = RouteProp<RootStackParamList, 'SuccessScreen'>;
type SuccessScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SuccessScreen'>;

const SuccessScreen: React.FC = () => {
  const navigation = useNavigation<SuccessScreenNavigationProp>();
  const route = useRoute<SuccessScreenRouteProp>();
  const { message } = route.params;

  const handleConcluir = () => {
    navigation.navigate('DashboardScreen');
  };

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle-outline" size={100} color="#4CAF50" />
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={handleConcluir}>
        <Text style={styles.buttonText}>Concluir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SuccessScreen;
