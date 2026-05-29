import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, StatusBar } from 'react-native';

export default function DashboardScreen() {
  const [count, setCount] = useState<number>(0);

  const handlePress = (): void => {
    setCount(count + 1);
    if (count === 4) {
      Alert.alert(
        "Teste Concluído!", 
        "Seu ambiente Expo com TypeScript está rodando perfeitamente."
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Text style={styles.title}>Olá, Desenvolvedor!</Text>
      <Text style={styles.subtitle}>
        Esta é uma tela de teste para validar a estrutura do seu projeto.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>Séries de levantamento de peso concluídas:</Text>
        <Text style={styles.counter}>{count}</Text>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Registrar Nova Série</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32,
  },
  cardText: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 12,
    textAlign: 'center',
  },
  counter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3182CE',
  },
  button: {
    backgroundColor: '#3182CE',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});