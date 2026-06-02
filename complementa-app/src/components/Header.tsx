

/////  Botões de Navegação  /////

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  // O hook useNavigation nos dá o poder de navegar de qualquer componente
  // Colocamos <any> temporariamente para facilitar os testes
  const navigation = useNavigation<any>(); 

  return (
    <View style={styles.headerContainer}>
      {/* Botão para ir para a Dashboard */}
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.navButtonText}>Início</Text>
      </TouchableOpacity>

      {/* Botão para ir para a tela de Upload */}
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.navButtonText}>Enviar Arquivo</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.logoutButton}>Sair</Text>
      </TouchableOpacity>      
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E3A8A', // Cor do cabeçalho
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // Dá espaço para a barra de status do celular
    paddingBottom: 30,
    paddingHorizontal: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Sombra no Android
    borderRadius: 80,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navButtonText: {
    backgroundColor: '#2B6CB0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
    logoutButton: {
    backgroundColor: '#E53E3E', // Cor vermelha para indicar saída
    paddingVertical: 6,
    // paddingHorizontal: 14,
    borderRadius: 6,
  },
});
