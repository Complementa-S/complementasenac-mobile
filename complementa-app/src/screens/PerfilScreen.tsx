import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, StatusBar, ScrollView,
  TouchableOpacity, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

const STORAGE_KEY = '@perfil_aluno';

export default function PerfilScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('usuario@gmail.com');
  const [telefone, setTelefone] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [alterado, setAlterado] = useState(false);
  const [emailOriginal, setEmailOriginal] = useState('usuario@gmail.com');
  const [telefoneOriginal, setTelefoneOriginal] = useState('');

  const nomeCompleto = 'Abra10 Joga Fácil';
  const ingresso = '2023';
  const curso = 'Análise e Desenvolvimento de Sistemas';
  const departamento = 'Tecnologia da Informação';
  const matricula = '0020025227';
  const iniciais = nomeCompleto.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await AsyncStorage.getItem(STORAGE_KEY);
        if (dados) {
          const parsed = JSON.parse(dados);
          setEmail(parsed.email || 'usuario@gmail.com');
          setTelefone(parsed.telefone || '');
          setEmailOriginal(parsed.email || 'usuario@gmail.com');
          setTelefoneOriginal(parsed.telefone || '');
        }
      } catch (e) {
        console.log('Erro ao carregar perfil:', e);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  useEffect(() => {
    setAlterado(email !== emailOriginal || telefone !== telefoneOriginal);
  }, [email, telefone, emailOriginal, telefoneOriginal]);

  const validarEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const salvar = async () => {
    if (!validarEmail(email)) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido.');
      return;
    }
    setSalvando(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ email, telefone }));
      setEmailOriginal(email);
      setTelefoneOriginal(telefone);
      setAlterado(false);
      Alert.alert('✓ Salvo!', 'Suas informações foram atualizadas com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      <View style={styles.headerAzul}>
        <View style={styles.linhaSuperior}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Meu Perfil</Text>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={styles.cardAluno}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarTexto}>{iniciais}</Text>
          </View>
          <Text style={styles.alunoNome}>{nomeCompleto}</Text>
          <Text style={styles.alunoEmail}>{email}</Text>
          <View style={styles.badgeAluno}>
            <Ionicons name="id-card-outline" size={13} color="#1E3A8A" />
            <Text style={styles.badgeAlunoTexto}>Aluno</Text>
          </View>
          <View style={styles.progressoContainer}>
            <Text style={styles.progressoLabel}>Progresso de horas</Text>
            <Text style={styles.progressoValor}>0/200h</Text>
          </View>
          <View style={styles.barraFundo}>
            <View style={[styles.barraPreenchida, { width: '0%' }]} />
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumero}>8</Text>
              <Text style={styles.statLabel}>Atividades</Text>
            </View>
            <View style={styles.statDivisor} />
            <View style={styles.statItem}>
              <Text style={styles.statNumero}>4</Text>
              <Text style={styles.statLabel}>Aprovadas</Text>
            </View>
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Informações pessoais</Text>
          <Text style={styles.secaoSubtitulo}>
            Apenas e-mail e telefone podem ser alterados.
          </Text>

          {[
            { label: 'Nome completo', valor: nomeCompleto },
            { label: 'Ingresso', valor: ingresso },
            { label: 'Curso', valor: curso },
            { label: 'Departamento', valor: departamento },
            { label: 'Matrícula / Registro', valor: matricula },
          ].map((campo, i) => (
            <View key={i} style={styles.campoContainer}>
              <Text style={styles.campoLabel}>{campo.label}</Text>
              <View style={styles.campoReadOnly}>
                <Text style={styles.campoReadOnlyTexto}>{campo.valor}</Text>
                <Ionicons name="lock-closed-outline" size={14} color="#9CA3AF" />
              </View>
            </View>
          ))}

          <View style={styles.campoContainer}>
            <Text style={styles.campoLabel}>
              E-mail <Text style={styles.editavelTag}>editável</Text>
            </Text>
            <TextInput
              style={[styles.campoInput, !validarEmail(email) && email.length > 0 && styles.campoInputErro]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="seu@email.com"
              placeholderTextColor="#9CA3AF"
            />
            {!validarEmail(email) && email.length > 0 && (
              <Text style={styles.erroTexto}>E-mail inválido</Text>
            )}
          </View>

          <View style={styles.campoContainer}>
            <Text style={styles.campoLabel}>
              Telefone <Text style={styles.editavelTag}>editável</Text>
            </Text>
            <TextInput
              style={styles.campoInput}
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
              placeholder="(00) 00000-0000"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.botaoSalvar, !alterado && styles.botaoSalvarDesabilitado]}
          onPress={salvar}
          disabled={salvando || !alterado}
        >
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.botaoSalvarTexto}>
                {alterado ? 'Salvar alterações' : 'Nenhuma alteração'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerAzul: {
    backgroundColor: '#1E3A8A', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 24,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  linhaSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  scrollView: { flex: 1, padding: 20 },
  cardAluno: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  avatarContainer: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarTexto: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  alunoNome: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  alunoEmail: { fontSize: 13, color: '#6B7280', marginBottom: 10 },
  badgeAluno: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, gap: 5, marginBottom: 20 },
  badgeAlunoTexto: { fontSize: 12, color: '#1E3A8A', fontWeight: '600' },
  progressoContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 6 },
  progressoLabel: { fontSize: 13, color: '#6B7280' },
  progressoValor: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  barraFundo: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, width: '100%', marginBottom: 20 },
  barraPreenchida: { height: 6, backgroundColor: '#1E3A8A', borderRadius: 3 },
  statsContainer: { flexDirection: 'row', width: '100%', justifyContent: 'center', gap: 40 },
  statItem: { alignItems: 'center' },
  statNumero: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  statDivisor: { width: 1, height: 36, backgroundColor: '#E5E7EB', alignSelf: 'center' },
  secao: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  secaoTitulo: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  secaoSubtitulo: { fontSize: 12, color: '#6B7280', marginBottom: 18, lineHeight: 18 },
  campoContainer: { marginBottom: 14 },
  campoLabel: { fontSize: 12, color: '#6B7280', marginBottom: 6, fontWeight: '500' },
  editavelTag: { color: '#10B981', fontWeight: '600', fontSize: 11 },
  campoInput: {
    borderWidth: 1.5, borderColor: '#3B82F6', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14,
    color: '#111827', backgroundColor: '#F0F9FF',
  },
  campoInputErro: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  erroTexto: { fontSize: 11, color: '#EF4444', marginTop: 4 },
  campoReadOnly: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#F9FAFB',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  campoReadOnlyTexto: { fontSize: 14, color: '#9CA3AF', flex: 1 },
  botaoSalvar: {
    backgroundColor: '#1E3A8A', borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  botaoSalvarDesabilitado: { backgroundColor: '#93C5FD' },
  botaoSalvarTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});