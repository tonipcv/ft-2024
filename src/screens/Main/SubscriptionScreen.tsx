import React from 'react';
import { View, Text, Button } from 'react-native';

const SubscriptionScreen: React.FC = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text>Escolha um plano de assinatura</Text>
      <Button title="Assinar Plano" onPress={() => { /* Integrar com Stripe ou App Store */ }} />
    </View>
  );
};

export default SubscriptionScreen;
