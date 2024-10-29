'use client';

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  Linking 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSupabase } from '../../src/context/SupabaseProvider';

interface Message {
  text: string;
  createdAt: string;
}

const formatDate = (dateString: string) => {
  try {
    // Converter a string ISO para objeto Date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ''; // Retorna string vazia se a data for inválida
    }

    const now = new Date();
    const brazilTimeOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };

    const time = date.toLocaleTimeString('pt-BR', brazilTimeOptions);
    const today = new Date(now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    const messageDate = new Date(date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.getTime() === today.getTime()) {
      return `Hoje, ${time}`;
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return `Ontem, ${time}`;
    } else {
      return date.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const formatMessage = (text: string) => {
  const lines = text.split('\n');
  let messageType = 'default';
  let textColor = '#fff';

  if (text.includes('COMPRA')) {
    messageType = 'buy';
    textColor = '#22c55e';
  } else if (text.includes('Take - Profit')) {
    messageType = 'takeProfit';
    textColor = '#3b82f6';
  } else if (text.includes('cancelado')) {
    messageType = 'canceled';
    textColor = '#6b7280';
  }

  return {
    type: messageType,
    formattedText: lines.map((line, index) => ({
      text: line,
      color: index === 0 ? textColor : '#fff'
    }))
  };
};

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { supabase } = useSupabase();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('https://servidor-servidor-telegram.dpbdp1.easypanel.host/messages/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.iconButton}
          >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/ft-icone.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={fetchMessages}
            style={styles.iconButton}
            disabled={isRefreshing}
          >
            <Ionicons 
              name="refresh" 
              size={24} 
              color="#fff"
              style={isRefreshing ? styles.rotating : undefined}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Sinais de Entradas:</Text>
      
      <View style={styles.messagesContainer}>
        <ScrollView style={styles.scrollView}>
          {messages.map((message, index) => {
            const formattedMessage = formatMessage(message.text);
            return (
              <View 
                key={index} 
                style={[
                  styles.messageCard,
                  styles[`${formattedMessage.type}Border`]
                ]}
              >
                {formattedMessage.formattedText.map((line, lineIndex) => (
                  <Text 
                    key={lineIndex} 
                    style={[styles.messageText, { color: line.color }]}
                  >
                    {line.text}
                  </Text>
                ))}
                <Text style={styles.dateText}>
                  {formatDate(message.createdAt)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => Linking.openURL('https://apps.apple.com/app/bybit-buy-bitcoin-crypto/id1494961956')}
      >
        <Text style={styles.buttonText}>Enviar Ordem</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerLeft: {
    width: 40,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },
  logo: {
    width: 80,
    height: 40,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  messageCard: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  buyBorder: {
    borderLeftColor: '#22c55e',
  },
  takeProfitBorder: {
    borderLeftColor: '#3b82f6',
  },
  canceledBorder: {
    borderLeftColor: '#6b7280',
  },
  defaultBorder: {
    borderLeftColor: '#374151',
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  dateText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconButton: {
    padding: 8,
  },
  rotating: {
    transform: [{ rotate: '360deg' }],
    opacity: 0.7,
  },
});
