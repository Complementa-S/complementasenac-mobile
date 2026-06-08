import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Footer from '../components/Footer';

export default function DashboardScreen() {
  const aluno = {
    nome: 'Abraão Musafa',
    curso: 'Análise e Desenvolvimento de Sistemas',
    matricula: '0020010',
  };

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const horasConcluidas = 100;
  const horasTotal = 200;
  const progresso = horasConcluidas / horasTotal;
  const percentual = Math.round(progresso * 100);
  const atividadesAprovadas = 5;
  const status = 'Em progresso';

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const dataFormatada = hoje.charAt(0).toUpperCase() + hoje.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      <View style={styles.container}>
        {/* ── Header Azul ── */}
        <View style={styles.headerAzul}>
          <View style={styles.linhaSuperior}>
            <View style={{ flex: 1 }}>
              <Text style={styles.saudacao}>Olá, {aluno.nome.split(' ')[0]} 👋</Text>
              <Text style={styles.data}>{dataFormatada}</Text>
            </View>
            <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
          </View>

          {/* Detalhes do aluno */}
          <View style={styles.detalhesAluno}>
            <Text style={styles.curso}>Curso: {aluno.curso}</Text>
            <Text style={styles.matriculaAluno}>Matrícula: {aluno.matricula}</Text>
          </View>
        </View>

        {/* ── Card Carga Complementar ── */}
        <View style={styles.cardWrapper}>
          <TouchableOpacity style={styles.card} activeOpacity={0.85}
            onPress={() => navigation.navigate('CargaComplementar')}>
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
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  linhaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  saudacao: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  data: { fontSize: 13, color: '#93C5FD' },

  detalhesAluno: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  nomeCompleto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  curso: {
    fontSize: 13,
    color: '#BFDBFE',
  },
  matriculaAluno: {
    fontSize: 13,
    color: '#93C5FD',
    fontWeight: '500',
  },

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
  cardTitulo: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  badge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeTexto: { fontSize: 12, color: '#1E3A8A', fontWeight: '600' },
  horasRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  horasNumero: { fontSize: 40, fontWeight: 'bold', color: '#111827', lineHeight: 44 },
  horasTotal: { fontSize: 18, color: '#6B7280', marginBottom: 4, marginLeft: 2 },
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
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  footerTexto: { fontSize: 12, color: '#6B7280' },
});