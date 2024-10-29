import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from './SupabaseProvider';
import { User, AuthError } from '@supabase/supabase-js';
import { Alert } from 'react-native';

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

interface AuthContextData extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { supabase } = useSupabase();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Carregar sessão inicial
    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setState(prevState => ({
          ...prevState,
          user: session?.user ?? null,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        setState(prevState => ({
          ...prevState,
          isLoading: false,
        }));
      }
    };

    loadSession();

    // Configurar listener de mudança de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState(prevState => ({
          ...prevState,
          user: session?.user ?? null,
        }));
      }
    );

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleAuthError = (error: AuthError) => {
    const errorMessage = error.message || 'Ocorreu um erro durante a autenticação';
    Alert.alert('Erro', errorMessage);
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    }
  };

  const value = {
    ...state,
    signIn,
    signOut,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
