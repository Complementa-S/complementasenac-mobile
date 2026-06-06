import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Footer from '../components/Footer';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();

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
        <View style={styles.gridCards}>

          {/* Card - Carga Complementar */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CargaComplementar')}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="time-outline" size={28} color="#1E3A8A" />
            </View>
            <Text style={styles.cardTitulo}>Carga Complementar</Text>
            <Text style={styles.cardSubtitulo}>0/200h concluídas</Text>
          </TouchableOpacity>

          {/* Card - Relatório */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Relatorio')}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="bar-chart-outline" size={28} color="#1E3A8A" />
            </View>
            <Text style={styles.cardTitulo}>Relatório</Text>
            <Text style={styles.cardSubtitulo}>Ver todos os relatórios</Text>
          </TouchableOpacity>

          {/* Card - Meu Perfil */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Perfil')}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="person-outline" size={28} color="#1E3A8A" />
            </View>
            <Text style={styles.cardTitulo}>Meu Perfil</Text>
            <Text style={styles.cardSubtitulo}>Abraão</Text>
          </TouchableOpacity>

        </View>
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
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
  saudacao: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  data: { fontSize: 14, color: '#93C5FD' },
  estatisticasContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  colunaStat: { alignItems: 'center' },
  numeroStat: { fontSize: 32, fontWeight: 'bold', color: '#A7F3D0', marginBottom: 8 },
  textoStat: { fontSize: 12, color: '#FFFFFF', textAlign: 'center' },
  linhaDivisoria: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  restoDaTela: { flex: 0.9, padding: 24 },
  gridCards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIconContainer: {
    backgroundColor: '#EFF6FF',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: '#1E3A8A', marginBottom: 4 },
  cardSubtitulo: { fontSize: 12, color: '#6B7280' },
});