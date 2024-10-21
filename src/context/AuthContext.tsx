import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  plan: 'FREE' | 'PAID';  // Adicionando a propriedade 'plan'
  // Adicione outros campos do usuário conforme necessário
}

interface AuthContextData {
  user: User | null;
  login: (email: string, password: string) => Promise<{ token: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<{ token: string }>;
  updateUserPlan: (newPlan: 'FREE' | 'PAID') => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<{ token: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      setUser(user);
      
      return { token };
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<{ token: string }> => {
    try {
      const response = await api.post('/auth/register', { email, password });
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      setUser(user);
      
      return { token };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  const updateUserPlan = async (newPlan: 'FREE' | 'PAID') => {
    if (user) {
      const updatedUser = { ...user, plan: newPlan };
      setUser(updatedUser);
      // Aqui você deve implementar a lógica para atualizar o plano no backend
      // await api.post('/user/update-plan', { plan: newPlan });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUserPlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
