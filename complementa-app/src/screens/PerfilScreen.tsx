import React, { useCallback, useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../controllers/authController';
import { fetchPerfilAluno, fetchResumoAluno } from '../services/alunoApi';
import { theme } from '../constants/theme';
import { initialsFromName } from '../utils/formatters';

export default function PerfilScreen() {
  const navigation = useNavigation<any>();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<any>(null);
  const [resumo, setResumo] = useState<any>(null);

  const load = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const [perfilData, resumoData] = await Promise.all([
        fetchPerfilAluno(user.token),
        fetchResumoAluno(user.token),
      ]);
      setPerfil(perfilData);
      setResumo(resumoData);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

  const nome = perfil?.nome || user?.nome || 'Aluno';
  const iniciais = initialsFromName(nome);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primaryDark} />

      <View style={styles.header}>
        <View style={styles.linhaSuperior}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Meu perfil</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.cardAluno}>
            <View style={styles.avatarContainer}><Text style={styles.avatarTexto}>{iniciais}</Text></View>
            <Text style={styles.alunoNome}>{nome}</Text>
            <Text style={styles.alunoEmail}>{perfil?.email || user?.email}</Text>
            <View style={styles.badgeAluno}><Text style={styles.badgeAlunoTexto}>Aluno</Text></View>
            <Text style={styles.progressoValor}>
              {resumo?.horasConcluidas ?? 0}/{resumo?.horasNecessarias ?? 200}h concluidas
            </Text>
          </View>

          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Informacoes academicas</Text>
            {[
              { label: 'Curso', valor: perfil?.curso || '—' },
              { label: 'Matricula', valor: perfil?.matricula || '—' },
              { label: 'Departamento', valor: perfil?.departamento || '—' },
              { label: 'Atividades aprovadas', valor: String(resumo?.aprovadas ?? 0) },
              { label: 'Atividades pendentes', valor: String(resumo?.pendentes ?? 0) },
            ].map((campo) => (
              <View key={campo.label} style={styles.campoContainer}>
                <Text style={styles.campoLabel}>{campo.label}</Text>
                <View style={styles.campoReadOnly}><Text style={styles.campoReadOnlyTexto}>{campo.valor}</Text></View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.botaoLogoutTexto}>Sair da conta</Text>
          </TouchableOpacity>
          <View style={{ height: 24 }} />
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
  scrollView: { flex: 1, padding: 20 },
  cardAluno: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarTexto: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  alunoNome: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  alunoEmail: { fontSize: 13, color: theme.colors.textMuted, marginVertical: 6 },
  badgeAluno: { backgroundColor: theme.colors.accentSoft, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12 },
  badgeAlunoTexto: { fontSize: 12, color: theme.colors.primary, fontWeight: '600' },
  progressoValor: { fontSize: 14, color: theme.colors.textMuted, fontWeight: '600' },
  secao: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secaoTitulo: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 16 },
  campoContainer: { marginBottom: 12 },
  campoLabel: { fontSize: 12, color: theme.colors.textMuted, marginBottom: 6 },
  campoReadOnly: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
  },
  campoReadOnlyTexto: { fontSize: 14, color: theme.colors.text },
  botaoLogout: {
    backgroundColor: theme.colors.danger,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  botaoLogoutTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
