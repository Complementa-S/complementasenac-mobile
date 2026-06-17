import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { fetchResumoAluno } from '../services/alunoApi';
import { theme } from '../constants/theme';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState<any>(null);

  const load = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const data = await fetchResumoAluno(user.token);
      setResumo(data);
    } catch {
      setResumo(null);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const primeiroNome = user?.nome?.split(' ')[0] || 'Aluno';
  const horasConcluidas = resumo?.horasConcluidas ?? 0;
  const horasNecessarias = resumo?.horasNecessarias ?? 200;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primaryDark} />

      <View style={styles.header}>
        <View style={styles.linhaSuperior}>
          <View>
            <Text style={styles.saudacao}>Ola, {primeiroNome}</Text>
            <Text style={styles.data}>{resumo?.curso || 'Carga complementar'}</Text>
          </View>
          <Ionicons name="sparkles-outline" size={26} color="#FFFFFF" />
        </View>

        <View style={styles.estatisticasContainer}>
          <View style={styles.colunaStat}>
            <Text style={styles.numeroStat}>{loading ? '—' : resumo?.pendentes ?? 0}</Text>
            <Text style={styles.textoStat}>Pendentes</Text>
          </View>
          <View style={styles.linhaDivisoria} />
          <View style={styles.colunaStat}>
            <Text style={styles.numeroStat}>{loading ? '—' : resumo?.aprovadas ?? 0}</Text>
            <Text style={styles.textoStat}>Aprovadas</Text>
          </View>
          <View style={styles.linhaDivisoria} />
          <View style={styles.colunaStat}>
            <Text style={styles.numeroStat}>{loading ? '—' : `${horasConcluidas}h`}</Text>
            <Text style={styles.textoStat}>Concluidas</Text>
          </View>
        </View>
      </View>

      <View style={styles.restoDaTela}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.gridCards}>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CargaComplementar')}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="time-outline" size={28} color={theme.colors.primary} />
              </View>
              <Text style={styles.cardTitulo}>Carga Complementar</Text>
              <Text style={styles.cardSubtitulo}>
                {horasConcluidas}/{horasNecessarias}h concluidas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Relatorio')}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="bar-chart-outline" size={28} color={theme.colors.primary} />
              </View>
              <Text style={styles.cardTitulo}>Historico</Text>
              <Text style={styles.cardSubtitulo}>{resumo?.totalAtividades ?? 0} atividades</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Perfil')}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="person-outline" size={28} color={theme.colors.primary} />
              </View>
              <Text style={styles.cardTitulo}>Meu Perfil</Text>
              <Text style={styles.cardSubtitulo}>{user?.email}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    backgroundColor: theme.colors.primaryDark,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: theme.radius.header,
    borderBottomRightRadius: theme.radius.header,
  },
  linhaSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 },
  saudacao: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  data: { fontSize: 14, color: '#BFDBFE' },
  estatisticasContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  colunaStat: { alignItems: 'center', flex: 1 },
  numeroStat: { fontSize: 28, fontWeight: 'bold', color: '#A7F3D0', marginBottom: 6 },
  textoStat: { fontSize: 12, color: '#FFFFFF', textAlign: 'center' },
  linhaDivisoria: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  restoDaTela: { flex: 1, padding: 24 },
  gridCards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: 20,
    width: '47%',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardIconContainer: {
    backgroundColor: theme.colors.accentSoft,
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  cardSubtitulo: { fontSize: 12, color: theme.colors.textMuted },
});
