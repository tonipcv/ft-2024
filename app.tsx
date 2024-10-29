import React from 'react';
import { SupabaseProvider } from './src/context/SupabaseProvider';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SupabaseProvider>
  );
};

export default App;
