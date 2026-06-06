import React, { useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar, ScrollView, TouchableOpacity,
  Modal, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import Footer from '../components/Footer';

type Arquivo = {
  nome: string;
  uri: string;
  tipo: string;
  tamanho: number;
};

type Submissao = {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  arquivo: Arquivo | null;
  status: 'Pendente' | 'Aprovado' | 'Indeferida';
  data: string;
  horas: string;
};

const categorias = ['Ensino', 'Extensão', 'Pesquisa', 'Outros'];

const corCategoria: Record<string, string> = {
  Ensino:   '#3B82F6',
  Extensão: '#10B981',
  Pesquisa: '#F59E0B',
  Outros:   '#8B5CF6',
};

const iconeCategoria: Record<string, any> = {
  Ensino:   'school-outline',
  Extensão: 'people-outline',
  Pesquisa: 'briefcase-outline',
  Outros:   'ribbon-outline',
};

const totaisCategoria: Record<string, number> = {
  Ensino: 60, Extensão: 80, Pesquisa: 40, Outros: 20,
};

export default function CargaComplementarScreen() {
  const navigation = useNavigation<any>();

  const [modalVisible, setModalVisible] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horas, setHoras] = useState('');
  const [arquivo, setArquivo] = useState<Arquivo | null>(null);

  const [submissoes, setSubmissoes] = useState<Submissao[]>([]);

  const totalHorasAprovadas = submissoes
    .filter(s => s.status === 'Aprovado')
    .reduce((acc, s) => acc + parseInt(s.horas || '0'), 0);

  const percentual = Math.min((totalHorasAprovadas / 200) * 100, 100).toFixed(0);

  const abrirDocumento = async () => {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*',
               'application/msword',
               'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!resultado.canceled && resultado.assets.length > 0) {
        const asset = resultado.assets[0];
        setArquivo({
          nome: asset.name,
          uri: asset.uri,
          tipo: asset.mimeType || 'desconhecido',
          tamanho: asset.size || 0,
        });
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir o arquivo.');
    }
  };

  const formatarTamanho = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const limparFormulario = () => {
    setTitulo('');
    setCategoria('');
    setDescricao('');
    setHoras('');
    setArquivo(null);
  };

  const enviarSubmissao = async () => {
    if (!titulo.trim()) { Alert.alert('Atenção', 'Informe o título da atividade.'); return; }
    if (!categoria) { Alert.alert('Atenção', 'Selecione uma categoria.'); return; }
    if (!horas.trim() || isNaN(Number(horas))) { Alert.alert('Atenção', 'Informe a quantidade de horas válida.'); return; }
    if (!arquivo) { Alert.alert('Atenção', 'Anexe um documento comprobatório.'); return; }

    setEnviando(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const nova: Submissao = {
      id: `SUB${Date.now()}`,
      titulo: titulo.trim(),
      categoria,
      descricao: descricao.trim(),
      arquivo,
      status: 'Pendente',
      data: new Date().toLocaleDateString('pt-BR'),
      horas,
    };

    setSubmissoes(prev => [nova, ...prev]);
    setEnviando(false);
    setModalVisible(false);
    limparFormulario();
    Alert.alert('Enviado!', 'Sua atividade foi enviada para análise do coordenador.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      {/* HEADER */}
      <View style={styles.headerAzul}>
        <View style={styles.linhaSuperior}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Carga Complementar</Text>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* CARD STATUS */}
        <View style={styles.cardStatus}>
          <View style={styles.cardStatusTopo}>
            <Text style={styles.cardStatusTitulo}>Carga complementar</Text>
            <View style={styles.badgeProgresso}>
              <Text style={styles.badgeProgressoTexto}>Em progresso</Text>
            </View>
          </View>
          <Text style={styles.horasTexto}>
            <Text style={styles.horasNumero}>{totalHorasAprovadas}</Text>
            <Text style={styles.horasTotal}>/200h</Text>
          </Text>
          <View style={styles.barraFundo}>
            <View style={[styles.barraPreenchida, { width: `${percentual}%` as any }]} />
          </View>
          <View style={styles.cardStatusRodape}>
            <Text style={styles.percentualTexto}>{percentual}% concluído</Text>
            <Text style={styles.atividadesTexto}>
              {submissoes.filter(s => s.status === 'Aprovado').length} atividades aprovadas
            </Text>
          </View>
        </View>

        {/* CATEGORIAS */}
        <Text style={styles.secaoTitulo}>Categorias</Text>
        {categorias.map((cat, index) => {
          const horasCat = submissoes
            .filter(s => s.categoria === cat && s.status === 'Aprovado')
            .reduce((acc, s) => acc + parseInt(s.horas || '0'), 0);
          const pct = Math.min((horasCat / totaisCategoria[cat]) * 100, 100);
          const cor = corCategoria[cat];
          return (
            <View key={index} style={styles.cardCategoria}>
              <View style={[styles.categoriaIcone, { backgroundColor: cor + '20' }]}>
                <Ionicons name={iconeCategoria[cat]} size={22} color={cor} />
              </View>
              <View style={styles.categoriaInfo}>
                <Text style={styles.categoriaTitulo}>{cat}</Text>
                <View style={styles.miniBarraFundo}>
                  <View style={[styles.miniBarraPreenchida, { width: `${pct}%` as any, backgroundColor: cor }]} />
                </View>
              </View>
              <View style={styles.categoriaHoras}>
                <Text style={[styles.categoriaHorasNumero, { color: cor }]}>{horasCat}h</Text>
                <Text style={styles.categoriaHorasTotal}>/{totaisCategoria[cat]}h</Text>
              </View>
            </View>
          );
        })}

        {/* MINHAS SUBMISSÕES */}
        {submissoes.length > 0 && (
          <>
            <Text style={[styles.secaoTitulo, { marginTop: 8 }]}>Minhas Submissões</Text>
            {submissoes.map((sub, i) => (
              <View key={i} style={styles.cardSubmissao}>
                <View style={styles.submissaoLinha}>
                  <View style={[styles.submissaoIcone, { backgroundColor: (corCategoria[sub.categoria] || '#6B7280') + '20' }]}>
                    <Ionicons name={iconeCategoria[sub.categoria] || 'document-outline'} size={18} color={corCategoria[sub.categoria] || '#6B7280'} />
                  </View>
                  <View style={styles.submissaoInfo}>
                    <Text style={styles.submissaoTitulo}>{sub.titulo}</Text>
                    <Text style={styles.submissaoMeta}>{sub.categoria} · {sub.data} · {sub.horas}h</Text>
                    {sub.arquivo && (
                      <View style={styles.submissaoArquivo}>
                        <Ionicons name="attach-outline" size={12} color="#6B7280" />
                        <Text style={styles.submissaoArquivoNome} numberOfLines={1}>{sub.arquivo.nome}</Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.badgeStatus, {
                    backgroundColor: sub.status === 'Aprovado' ? '#D1FAE5' : sub.status === 'Indeferida' ? '#FEE2E2' : '#FEF9C3'
                  }]}>
                    <Text style={[styles.badgeStatusTexto, {
                      color: sub.status === 'Aprovado' ? '#065F46' : sub.status === 'Indeferida' ? '#991B1B' : '#92400E'
                    }]}>{sub.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* BOTÃO NOVA SUBMISSÃO */}
        <TouchableOpacity style={styles.botaoSubmissao} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.botaoSubmissaoTexto}>Nova Submissão</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setModalVisible(false); limparFormulario(); }}>
              <Ionicons name="close-outline" size={28} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitulo}>Nova Submissão</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>

            <Text style={styles.modalLabel}>Título da atividade *</Text>
            <TextInput
              style={styles.modalInput}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Curso de Python Avançado"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.modalLabel}>Categoria *</Text>
            <View style={styles.categoriasGrid}>
              {categorias.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoriaChip, categoria === cat && { backgroundColor: corCategoria[cat], borderColor: corCategoria[cat] }]}
                  onPress={() => setCategoria(cat)}
                >
                  <Ionicons name={iconeCategoria[cat]} size={16} color={categoria === cat ? '#FFFFFF' : corCategoria[cat]} />
                  <Text style={[styles.categoriaChipTexto, categoria === cat && { color: '#FFFFFF' }]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Quantidade de horas *</Text>
            <TextInput
              style={styles.modalInput}
              value={horas}
              onChangeText={setHoras}
              placeholder="Ex: 40"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />

            <Text style={styles.modalLabel}>Descrição</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputMultilinha]}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descreva brevemente a atividade realizada..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.modalLabel}>Documento comprobatório *</Text>
            <TouchableOpacity style={styles.botaoAnexar} onPress={abrirDocumento}>
              <Ionicons name="cloud-upload-outline" size={24} color="#1E3A8A" />
              <Text style={styles.botaoAnexarTexto}>{arquivo ? 'Trocar arquivo' : 'Selecionar arquivo'}</Text>
              <Text style={styles.botaoAnexarSub}>PDF, imagem ou Word</Text>
            </TouchableOpacity>

            {arquivo && (
              <View style={styles.arquivoSelecionado}>
                <Ionicons name="document-attach-outline" size={20} color="#1E3A8A" />
                <View style={styles.arquivoInfo}>
                  <Text style={styles.arquivoNome} numberOfLines={1}>{arquivo.nome}</Text>
                  <Text style={styles.arquivoTamanho}>{formatarTamanho(arquivo.tamanho)}</Text>
                </View>
                <TouchableOpacity onPress={() => setArquivo(null)}>
                  <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.botaoEnviar, enviando && { opacity: 0.7 }]}
              onPress={enviarSubmissao}
              disabled={enviando}
            >
              {enviando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="send-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.botaoEnviarTexto}>Enviar para análise</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerAzul: {
    backgroundColor: '#1E3A8A', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 24,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  linhaSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  scrollView: { flex: 1, padding: 20 },
  cardStatus: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  cardStatusTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardStatusTitulo: { fontSize: 14, color: '#6B7280' },
  badgeProgresso: { backgroundColor: '#EFF6FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeProgressoTexto: { fontSize: 12, color: '#1E3A8A', fontWeight: '600' },
  horasTexto: { marginBottom: 14 },
  horasNumero: { fontSize: 36, fontWeight: 'bold', color: '#111827' },
  horasTotal: { fontSize: 18, color: '#6B7280' },
  barraFundo: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 12 },
  barraPreenchida: { height: 8, backgroundColor: '#1E3A8A', borderRadius: 4 },
  cardStatusRodape: { flexDirection: 'row', justifyContent: 'space-between' },
  percentualTexto: { fontSize: 13, color: '#6B7280' },
  atividadesTexto: { fontSize: 13, color: '#6B7280' },
  secaoTitulo: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  cardCategoria: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  categoriaIcone: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  categoriaInfo: { flex: 1 },
  categoriaTitulo: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 8 },
  miniBarraFundo: { height: 5, backgroundColor: '#E5E7EB', borderRadius: 3 },
  miniBarraPreenchida: { height: 5, borderRadius: 3 },
  categoriaHoras: { flexDirection: 'row', alignItems: 'baseline', marginLeft: 12 },
  categoriaHorasNumero: { fontSize: 16, fontWeight: 'bold' },
  categoriaHorasTotal: { fontSize: 12, color: '#9CA3AF' },
  cardSubmissao: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  submissaoLinha: { flexDirection: 'row', alignItems: 'center' },
  submissaoIcone: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  submissaoInfo: { flex: 1 },
  submissaoTitulo: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  submissaoMeta: { fontSize: 11, color: '#6B7280', marginBottom: 4 },
  submissaoArquivo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  submissaoArquivoNome: { fontSize: 11, color: '#6B7280', flex: 1 },
  badgeStatus: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  badgeStatusTexto: { fontSize: 11, fontWeight: '700' },
  botaoSubmissao: {
    backgroundColor: '#1E3A8A', borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8,
  },
  botaoSubmissaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  modalContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#111827' },
  modalScroll: { flex: 1, padding: 20 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 4 },
  modalInput: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14,
    color: '#111827', backgroundColor: '#F9FAFB', marginBottom: 16,
  },
  modalInputMultilinha: { height: 100, paddingTop: 12 },
  categoriasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  categoriaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    borderColor: '#E5E7EB', backgroundColor: '#F9FAFB',
  },
  categoriaChipTexto: { fontSize: 13, fontWeight: '600', color: '#374151' },
  botaoAnexar: {
    borderWidth: 2, borderColor: '#DBEAFE', borderStyle: 'dashed', borderRadius: 14,
    padding: 20, alignItems: 'center', backgroundColor: '#EFF6FF', marginBottom: 12, gap: 6,
  },
  botaoAnexarTexto: { fontSize: 15, fontWeight: '600', color: '#1E3A8A' },
  botaoAnexarSub: { fontSize: 12, color: '#6B7280' },
  arquivoSelecionado: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF',
    borderRadius: 12, padding: 12, marginBottom: 20, gap: 10,
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  arquivoInfo: { flex: 1 },
  arquivoNome: { fontSize: 13, fontWeight: '600', color: '#1E3A8A' },
  arquivoTamanho: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  botaoEnviar: {
    backgroundColor: '#1E3A8A', borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 4,
  },
  botaoEnviarTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});