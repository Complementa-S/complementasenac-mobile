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

      <Text style={styles.nome}>Olá, Abra10!</Text>
      <Text style={styles.inicio}>Início</Text>
      <Text style={styles.historico}>Histórico</Text>
      <Text style={styles.atividades}>Atividades</Text>
      

    </View>
  );}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  nome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    marginTop: 10,
    left:10,
    },
    meuQuadrado: {
    width: 100,           
    height: 100,             
    color: '#3182CE',
  },
  inicio: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A5568',
    position: 'absolute',
    top: 700,
    left: 20,
    
    },
    historico: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A5568',
    position: 'absolute',
    top: 700,
    right: 5,  
  },

  atividades:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A5568',
    position: 'absolute',
    top: 700,
    left: 140,  
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