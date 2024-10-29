import React from 'react';
import { Redirect } from 'expo-router';

export default function Auth() {
  // Redireciona para a tela de login
  return <Redirect href="/auth/login" />;
}
