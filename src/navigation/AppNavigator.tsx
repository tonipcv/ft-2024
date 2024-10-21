import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroScreen from '../screens/Main/IntroScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/Main/DashboardScreen';
import VerifyCodeScreen from '../screens/Auth/VerifyCodeScreen';  // Importe a VerifyCodeScreen
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="VerifyCodeScreen" component={VerifyCodeScreen} />  // Adicione esta linha
        {/* Adicione outras telas conforme necessário */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
