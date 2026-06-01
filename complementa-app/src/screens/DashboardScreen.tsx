import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      <View style={styles.headerAzul}>
        
        <View style={styles.linhaSuperior}>
          <View>
            <Text style={styles.saudacao}>Olá, Abraão</Text>
            <Text style={styles.data}>Segunda-feira, 01 Jun 2026</Text>
          </View>
          
          <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
        </View>

        <View style={styles.estatisticasContainer}>
          
          <View style={styles.colunaStat}>
            <Text style={styles.numeroStat}>08</Text>
            <Text style={styles.textoStat}>Horas{'\n'}Pendentes</Text> 
          </View>

          <View style={styles.linhaDivisoria} />

          <View style={styles.colunaStat}>
            <Text style={styles.numeroStat}>15</Text>
            <Text style={styles.textoStat}>Horas{'\n'}Em Análise</Text>
          </View>

          <View style={styles.linhaDivisoria} />

          <View style={styles.colunaStat}>
            <Text style={styles.numeroStat}>29</Text>
            <Text style={styles.textoStat}>Horas{'\n'}Concluídas</Text>
          </View>

        </View>
      </View>

      <View style={styles.restoDaTela}>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerAzul: {
    backgroundColor: '#1E3A8A',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  linhaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  saudacao: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  data: {
    fontSize: 14,
    color: '#93C5FD',
  },
  estatisticasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colunaStat: {
    alignItems: 'center',
  },
  numeroStat: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#A7F3D0',
    marginBottom: 8,
  },
  textoStat: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  linhaDivisoria: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  restoDaTela: {
    flex: 1,
    padding: 24,
  }
});