import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getTradeSignals } from '../../services/api';

interface TradeSignal {
  id: string;
  message: string;
  createdAt: string;
}

const DashboardScreen: React.FC = () => {
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { user } = useAuth();

  const fetchSignals = async () => {
    try {
      setError(null);
      const fetchedSignals = await getTradeSignals();
      setSignals(fetchedSignals);
    } catch (error) {
      console.error('Erro ao buscar sinais:', error);
      setError('Não foi possível carregar os sinais. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSignals();
  };

  const renderSignalItem = ({ item }: { item: TradeSignal }) => (
    <View style={styles.signalItem}>
      <Text style={styles.signalSender}>Futuros Tech</Text>
      <Text style={styles.signalMessage}>{item.message}</Text>
      <Text style={styles.signalDate}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchSignals}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {user?.plan !== 'PAID' && (
        <TouchableOpacity 
          style={styles.upgradeButton} 
          onPress={() => navigation.navigate('Upgrade' as never)}
        >
          <Text style={styles.upgradeButtonText}>Upgrade Rápido</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={signals}
        renderItem={renderSignalItem}
        keyExtractor={(item) => item.id}
        style={styles.signalList}
        inverted
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyListText}>Nenhum sinal disponível no momento.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  upgradeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signalList: {
    flex: 1,
  },
  signalItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  signalSender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  signalMessage: {
    marginBottom: 5,
  },
  signalDate: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'flex-end',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default DashboardScreen;
