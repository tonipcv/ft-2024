import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type IntroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Intro'>;

const IntroScreen: React.FC = () => {
  const navigation = useNavigation<IntroScreenNavigationProp>();

  const renderCarouselItem = ({ item }: { item: string }) => {
    return (
      <View style={styles.carouselItem}>
        <Text style={styles.carouselText}>{item}</Text>
      </View>
    );
  };

  const carouselItems = [
    'Bem-vindo ao Futuros Tech!',
    'Descubra sinais de trade em tempo real.',
    'Assine e acesse cursos e gráficos avançados.'
  ];

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/futuros-tech-logo.png')}
        style={styles.logo}
      />

      <Carousel
        data={carouselItems}
        renderItem={renderCarouselItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width - 60}
        loop
        autoplay
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.createAccountButton}
      >
        <Text style={styles.buttonText}>Criar Minha Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
        <Text style={styles.loginText}>Já tenho minha conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  carouselText: {
    fontSize: 18,
    textAlign: 'center',
  },
  createAccountButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  loginButton: {
    marginTop: 20,
  },
  loginText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default IntroScreen;
