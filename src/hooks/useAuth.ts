import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook que permite usar as funções de login e logout em qualquer componente
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider');
  }

  return context;
};
