import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Usando as variáveis de ambiente do Expo
const supabaseUrl = 'https://hzqhyzwzrblcjdgjmash.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6cWh5end6cmJsY2pkZ2ptYXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4NjE0NDAsImV4cCI6MjA0NTQzNzQ0MH0.T4Lt6Ci7Yro_SF6K4mXfavstyojL3BCfcDvRNJkSY3E';

export const supabaseClient = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export default supabaseClient;
