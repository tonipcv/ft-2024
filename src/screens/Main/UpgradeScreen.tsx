import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createCheckoutSession } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UpgradeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUserPlan } = useAuth();

  const handleUpgrade = async () => {
    try {
      const session = await createCheckoutSession();
      // Aqui você deve abrir o URL do Stripe Checkout
      // Como estamos em um ambiente mobile, você pode usar o Linking do React Native
      // ou uma WebView para abrir o URL do Stripe
      console.log('Stripe Checkout URL:', session.url);
      
      // Simular uma compra bem-sucedida (remova isto em produção)
      Alert.alert(
        "Compra Simulada",
        "Deseja simular uma compra bem-sucedida?",
        [
          {
            text: "Não",
            style: "cancel"
          },
          { 
            text: "Sim", 
            onPress: async () => {
              await updateUserPlan('PAID');
              navigation.navigate('Dashboard' as never);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      Alert.alert('Erro', 'Não foi possível iniciar o processo de upgrade. Tente novamente mais tarde.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upgrade para Futuros Tech Premium</Text>
      
      <View style={styles.featureContainer}>
        <Text style={styles.featureTitle}>Recursos Premium:</Text>
        <Text style={styles.feature}>• Acesso a sinais de trade em tempo real</Text>
        <Text style={styles.feature}>• Análises de mercado detalhadas</Text>
        <Text style={styles.feature}>• Suporte prioritário 24/7</Text>
        <Text style={styles.feature}>• Webinars exclusivos com especialistas</Text>
        <Text style={styles.feature}>• Ferramentas avançadas de análise técnica</Text>
      </View>

      <View style={styles.pricingContainer}>
        <Text style={styles.pricingTitle}>Preço:</Text>
        <Text style={styles.price}>R$ 99,90 / mês</Text>
        <Text style={styles.priceNote}>Cancele a qualquer momento</Text>
      </View>

      <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
        <Text style={styles.upgradeButtonText}>Fazer Upgrade Agora</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feature: {
    fontSize: 16,
    marginBottom: 5,
  },
  pricingContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceNote: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpgradeScreen;
