import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSupabase } from '../../src/context/SupabaseProvider';
import { router } from 'expo-router';

export default function AuthLayout() {
  const { supabase } = useSupabase();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(tabs)/dashboard');
      }
    });
  }, [supabase.auth]);

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
} 