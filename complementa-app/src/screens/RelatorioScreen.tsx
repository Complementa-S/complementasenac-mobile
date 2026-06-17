import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { getStudentSubmissions } from '../controllers/submissionController';
import { theme } from '../constants/theme';
import { Submission } from '../models/Submission';
import { formatShortDate, uiStatus } from '../utils/formatters';

const abas = ['Todas', 'Aprovado', 'Indeferida', 'Pendente'];

export default function RelatorioScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [atividades, setAtividades] = useState<Submission[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setAtividades(await getStudentSubmissions(user));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtradas = useMemo(() => {
    if (abaAtiva === 'Todas') return atividades;
    return atividades.filter((item) => uiStatus(item.status).label === abaAtiva);
  }, [atividades, abaAtiva]);

  const totalHoras = atividades
    .filter((a) => a.status === 'APROVADO')
    .reduce((acc, a) => acc + (a.horasAprovadas || a.horasInformadas || 0), 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primaryDark} />

      <View style={styles.header}>
        <View style={styles.linhaSuperior}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Historico completo</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={styles.resumoContainer}>
        <View style={styles.cardResumo}><Text style={styles.resumoNumero}>{atividades.length}</Text><Text style={styles.resumoLabel}>Registros</Text></View>
        <View style={styles.cardResumo}><Text style={styles.resumoNumero}>{totalHoras}h</Text><Text style={styles.resumoLabel}>Horas aprovadas</Text></View>
        <View style={styles.cardResumo}><Text style={styles.resumoNumero}>{atividades.filter((a) => a.status === 'PENDENTE').length}</Text><Text style={styles.resumoLabel}>Pendentes</Text></View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.abasScroll} contentContainerStyle={styles.abasContainer}>
        {abas.map((aba) => (
          <TouchableOpacity key={aba} style={[styles.aba, abaAtiva === aba && styles.abaAtiva]} onPress={() => setAbaAtiva(aba)}>
            <Text style={[styles.abaTexto, abaAtiva === aba && styles.abaTextoAtivo]}>{aba}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 30 }} />
      ) : (
        <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
          {filtradas.map((item) => {
            const status = uiStatus(item.status);
            return (
              <View key={item.id} style={styles.cardAtividade}>
                <Text style={styles.atividadeTitulo}>{item.titulo}</Text>
                <Text style={styles.atividadeMeta}>{item.categoria} · {formatShortDate(item.dataEnvio)} · {item.horasInformadas}h</Text>
                <View style={[styles.badge, status.tone === 'approved' && styles.badgeApproved, status.tone === 'rejected' && styles.badgeRejected]}>
                  <Text style={styles.badgeTexto}>{status.label}</Text>
                </View>
                {item.justificativaCoordenador ? (
                  <Text style={styles.motivo}>Motivo: {item.justificativaCoordenador}</Text>
                ) : null}
              </View>
            );
          })}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

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
    paddingBottom: 24,
    borderBottomLeftRadius: theme.radius.header,
    borderBottomRightRadius: theme.radius.header,
  },
  linhaSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  resumoContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  cardResumo: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resumoNumero: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
  resumoLabel: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },
  abasScroll: { maxHeight: 50, marginTop: 14 },
  abasContainer: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  aba: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border },
  abaAtiva: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  abaTexto: { fontSize: 13, color: theme.colors.textMuted },
  abaTextoAtivo: { color: '#FFFFFF', fontWeight: '700' },
  lista: { flex: 1, paddingHorizontal: 20, marginTop: 14 },
  cardAtividade: {
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  atividadeTitulo: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  atividadeMeta: { fontSize: 12, color: theme.colors.textMuted, marginVertical: 4 },
  badge: { alignSelf: 'flex-start', backgroundColor: theme.colors.pillPending, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  badgeApproved: { backgroundColor: theme.colors.pillApproved },
  badgeRejected: { backgroundColor: theme.colors.pillRejected },
  badgeTexto: { fontSize: 11, fontWeight: '700', color: theme.colors.text },
  motivo: { marginTop: 8, fontSize: 12, color: theme.colors.danger },
});
