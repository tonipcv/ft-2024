import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  DashboardScreen: undefined;
  ResetPasswordScreen: undefined;
  RegisterScreen: undefined;
  Upgrade: undefined;
  Dashboard: undefined;
  // Adicione outras telas aqui conforme necessário
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type UpgradeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Upgrade'>;
