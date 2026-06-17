import React, { useCallback, useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar, ScrollView, TouchableOpacity,
  Modal, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { getStudentSubmissions, submitActivity } from '../controllers/submissionController';
import { fetchResumoAluno } from '../services/alunoApi';
import { MAX_HORAS_POR_ATIVIDADE } from '../constants/hoursLimits';
import { categoryColors, categoryIcons, theme } from '../constants/theme';
import { Submission } from '../models/Submission';
import { formatShortDate, horasPorCategoria, uiStatus } from '../utils/formatters';

const categorias = ['Ensino', 'Extensao', 'Pesquisa'];
const totaisCategoria: Record<string, number> = { Ensino: 60, Extensao: 80, Pesquisa: 40 };

export default function CargaComplementarScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [horas, setHoras] = useState('');
  const [arquivo, setArquivo] = useState<{ nome: string; uri: string; mimeType?: string } | null>(null);
  const [submissoes, setSubmissoes] = useState<Submission[]>([]);
  const [resumo, setResumo] = useState<any>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [lista, resumoData] = await Promise.all([
        getStudentSubmissions(user),
        fetchResumoAluno(user.token),
      ]);
      setSubmissoes(lista);
      setResumo(resumoData);
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Nao foi possivel carregar os dados.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const horasConcluidas = resumo?.horasConcluidas ?? 0;
  const horasNecessarias = resumo?.horasNecessarias ?? 200;
  const percentual = Math.min((horasConcluidas / horasNecessarias) * 100, 100).toFixed(0);

  const abrirDocumento = async () => {
    const resultado = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });
    if (!resultado.canceled && resultado.assets.length > 0) {
      const asset = resultado.assets[0];
      setArquivo({ nome: asset.name, uri: asset.uri, mimeType: asset.mimeType || undefined });
    }
  };

  const limparFormulario = () => {
    setTitulo('');
    setCategoria('');
    setHoras('');
    setArquivo(null);
  };

  const enviarSubmissao = async () => {
    if (!user) return;
    if (!titulo.trim()) { Alert.alert('Atencao', 'Informe o titulo da atividade.'); return; }
    if (!categoria) { Alert.alert('Atencao', 'Selecione uma categoria.'); return; }
    if (!horas.trim()) { Alert.alert('Atencao', 'Informe a quantidade de horas.'); return; }
    if (!arquivo) { Alert.alert('Atencao', 'Anexe um comprovante.'); return; }

    setEnviando(true);
    try {
      await submitActivity(user, {
        titulo: titulo.trim(),
        categoria,
        horas: Number(horas),
        file: { uri: arquivo.uri, name: arquivo.nome, mimeType: arquivo.mimeType },
      });
      setModalVisible(false);
      limparFormulario();
      await load();
      Alert.alert('Enviado!', 'Atividade enviada para analise do coordenador.');
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Nao foi possivel enviar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primaryDark} />

      <View style={styles.header}>
        <View style={styles.linhaSuperior}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Carga Complementar</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.cardStatus}>
            <Text style={styles.cardStatusTitulo}>Progresso geral</Text>
            <Text style={styles.horasTexto}>
              <Text style={styles.horasNumero}>{horasConcluidas}</Text>
              <Text style={styles.horasTotal}>/{horasNecessarias}h</Text>
            </Text>
            <View style={styles.barraFundo}>
              <View style={[styles.barraPreenchida, { width: `${percentual}%` as any }]} />
            </View>
            <Text style={styles.percentualTexto}>{percentual}% concluido</Text>
          </View>

          <Text style={styles.secaoTitulo}>Categorias</Text>
          {categorias.map((cat) => {
            const horasCat = horasPorCategoria(submissoes, cat);
            const pct = Math.min((horasCat / totaisCategoria[cat]) * 100, 100);
            const cor = categoryColors[cat] || theme.colors.primary;
            return (
              <View key={cat} style={styles.cardCategoria}>
                <View style={[styles.categoriaIcone, { backgroundColor: cor + '20' }]}>
                  <Ionicons name={categoryIcons[cat] as any} size={22} color={cor} />
                </View>
                <View style={styles.categoriaInfo}>
                  <Text style={styles.categoriaTitulo}>{cat}</Text>
                  <View style={styles.miniBarraFundo}>
                    <View style={[styles.miniBarraPreenchida, { width: `${pct}%` as any, backgroundColor: cor }]} />
                  </View>
                </View>
                <Text style={[styles.categoriaHoras, { color: cor }]}>{horasCat}h</Text>
              </View>
            );
          })}

          <Text style={styles.secaoTitulo}>Minhas submissoes</Text>
          {submissoes.length === 0 ? (
            <Text style={styles.vazio}>Nenhuma atividade enviada ainda.</Text>
          ) : (
            submissoes.map((sub) => {
              const status = uiStatus(sub.status);
              return (
                <View key={sub.id} style={styles.cardSubmissao}>
                  <Text style={styles.submissaoTitulo}>{sub.titulo}</Text>
                  <Text style={styles.submissaoMeta}>
                    {sub.categoria} · {formatShortDate(sub.dataEnvio)} · {sub.horasInformadas}h
                  </Text>
                  <View style={[styles.badgeStatus, status.tone === 'approved' && styles.badgeApproved, status.tone === 'rejected' && styles.badgeRejected]}>
                    <Text style={styles.badgeStatusTexto}>{status.label}</Text>
                  </View>
                </View>
              );
            })
          )}

          <TouchableOpacity style={styles.botaoSubmissao} onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.botaoSubmissaoTexto}>Nova submissao</Text>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setModalVisible(false); limparFormulario(); }}>
              <Ionicons name="close-outline" size={28} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitulo}>Nova submissao</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalScroll}>
            <Text style={styles.modalLabel}>Titulo *</Text>
            <TextInput style={styles.modalInput} value={titulo} onChangeText={setTitulo} placeholder="Ex: Curso de Python" />

            <Text style={styles.modalLabel}>Categoria *</Text>
            <View style={styles.categoriasGrid}>
              {categorias.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoriaChip, categoria === cat && { backgroundColor: categoryColors[cat], borderColor: categoryColors[cat] }]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text style={[styles.categoriaChipTexto, categoria === cat && { color: '#FFF' }]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Horas * (max. {MAX_HORAS_POR_ATIVIDADE}h)</Text>
            <TextInput
              style={styles.modalInput}
              value={horas}
              onChangeText={setHoras}
              keyboardType="numeric"
              placeholder="Ex: 8"
              maxLength={2}
            />

            <Text style={styles.modalLabel}>Comprovante *</Text>
            <TouchableOpacity style={styles.botaoAnexar} onPress={abrirDocumento}>
              <Ionicons name="cloud-upload-outline" size={22} color={theme.colors.primary} />
              <Text style={styles.botaoAnexarTexto}>{arquivo ? arquivo.nome : 'Selecionar arquivo'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoEnviar} onPress={enviarSubmissao} disabled={enviando}>
              {enviando ? <ActivityIndicator color="#FFF" /> : <Text style={styles.botaoEnviarTexto}>Enviar para analise</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

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
  cardStatus: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardStatusTitulo: { fontSize: 14, color: theme.colors.textMuted, marginBottom: 8 },
  horasTexto: { marginBottom: 12 },
  horasNumero: { fontSize: 34, fontWeight: 'bold', color: theme.colors.text },
  horasTotal: { fontSize: 18, color: theme.colors.textMuted },
  barraFundo: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 8 },
  barraPreenchida: { height: 8, backgroundColor: theme.colors.primary, borderRadius: 4 },
  percentualTexto: { fontSize: 13, color: theme.colors.textMuted },
  secaoTitulo: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 12, marginTop: 8 },
  cardCategoria: {
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoriaIcone: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  categoriaInfo: { flex: 1 },
  categoriaTitulo: { fontSize: 15, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
  miniBarraFundo: { height: 5, backgroundColor: '#E5E7EB', borderRadius: 3 },
  miniBarraPreenchida: { height: 5, borderRadius: 3 },
  categoriaHoras: { fontSize: 16, fontWeight: 'bold' },
  vazio: { color: theme.colors.textMuted, marginBottom: 16 },
  cardSubmissao: {
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  submissaoTitulo: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  submissaoMeta: { fontSize: 12, color: theme.colors.textMuted, marginVertical: 4 },
  badgeStatus: { alignSelf: 'flex-start', backgroundColor: theme.colors.pillPending, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  badgeApproved: { backgroundColor: theme.colors.pillApproved },
  badgeRejected: { backgroundColor: theme.colors.pillRejected },
  badgeStatusTexto: { fontSize: 11, fontWeight: '700', color: theme.colors.text },
  botaoSubmissao: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  botaoSubmissaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  modalContainer: { flex: 1, backgroundColor: theme.colors.card },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  modalScroll: { flex: 1, padding: 20 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.text, marginBottom: 8, marginTop: 4 },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    marginBottom: 16,
  },
  categoriasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  categoriaChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  categoriaChipTexto: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
  botaoAnexar: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.accentSoft,
    marginBottom: 20,
  },
  botaoAnexarTexto: { fontSize: 14, fontWeight: '600', color: theme.colors.primary, marginTop: 6 },
  botaoEnviar: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoEnviarTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
