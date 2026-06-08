import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

import Footer from '../components/Footer';

export default function DashboardScreen() {
  // const navigation = useNavigation<any>();

  // Dados de exemplo — substitua pelos dados reais
  const horasConcluidas = 100;
  const horasTotal = 200;
  const progresso = horasConcluidas / horasTotal;
  const percentual = Math.round(progresso * 100);
  const atividadesAprovadas = 5;
  const status = 'Em progresso';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      <View style={styles.container}>
        {/* ── Header Azul ── */}
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

        {/* ── Card Carga Complementar ── */}
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            // onPress={() => navigation.navigate('CargaComplementar')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo}>Carga complementar</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeTexto}>{status}</Text>
              </View>
            </View>

            <View style={styles.horasRow}>
              <Text style={styles.horasNumero}>{horasConcluidas}</Text>
              <Text style={styles.horasTotal}>/{horasTotal}h</Text>
            </View>

            <View style={styles.barraFundo}>
              <View style={[styles.barraPreenchida, { width: `${percentual}%` }]} />
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.footerTexto}>{percentual}% concluído</Text>
              <Text style={styles.footerTexto}>{atividadesAprovadas} atividades aprovadas</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Footer />
    </SafeAreaView>
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
  estatisticasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colunaStat: { alignItems: 'center' },
  numeroStat: { fontSize: 32, fontWeight: 'bold', color: '#A7F3D0', marginBottom: 8 },
  textoStat: { fontSize: 12, color: '#FFFFFF', textAlign: 'center' },
  linhaDivisoria: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },

  cardWrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitulo: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeTexto: {
    fontSize: 12,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  horasRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  horasNumero: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 44,
  },
  horasTotal: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 4,
    marginLeft: 2,
  },
  barraFundo: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  barraPreenchida: {
    height: '100%',
    backgroundColor: '#1E3A8A',
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerTexto: {
    fontSize: 12,
    color: '#6B7280',
  },
});