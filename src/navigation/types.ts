import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  VerifyCodeScreen: { email: string; isPasswordReset: boolean };
  InsertNewPassword: { email: string; code: string };
  SuccessScreen: { message: string };  // Adicionando o parâmetro message
  DashboardScreen: undefined;
  // Adicione outras telas conforme necessário
};

export type VerifyCodeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyCodeScreen'>;
