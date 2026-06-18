import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

import { PickedFile } from '../models/Submission';
import { submitActivity } from '../controllers/submissionController';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
};

const categorias = ['Extensao', 'Ensino', 'Pesquisa', 'Outros'];

const cursos = [
  'Administração',
  'Tecnologia da Informação',
  'Moda',
  'English',
  'Contabilidade',
  'Recursos Humanos',
  'Marketing',
  'Logística',
  'Gastronomia',
  'Design Gráfico',
];

export default function SubmissionModal({ visible, onClose, onSubmitted }: Props) {
  const { user } = useAuth();

  const [titulo, setTitulo]           = useState('');
  const [categoria, setCategoria]     = useState('Extensao');
  const [curso, setCurso]             = useState('');
  const [horas, setHoras]             = useState('');
  const [file, setFile]               = useState<PickedFile | null>(null);
  const [loading, setLoading]         = useState(false);
  const [cursoAberto, setCursoAberto] = useState(false);

  const reset = () => {
    setTitulo('');
    setCategoria('Extensao');
    setCurso('');
    setHoras('');
    setFile(null);
    setCursoAberto(false);
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setFile({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType });
    }
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    if (!titulo.trim()) { Alert.alert('Atenção', 'Informe o nome da atividade.'); return; }
    if (!curso) { Alert.alert('Atenção', 'Selecione o curso.'); return; }
    if (!horas || isNaN(Number(horas.replace(',', '.')))) { Alert.alert('Atenção', 'Informe uma quantidade de horas válida.'); return; }
    if (!file) { Alert.alert('Atenção', 'Selecione um arquivo.'); return; }

    try {
      setLoading(true);
      await submitActivity(user, {
        titulo,
        categoria,
        curso,
        horas: Number(horas.replace(',', '.')),
        file: file as PickedFile,
      });
      Alert.alert('Enviado!', 'Sua atividade foi enviada para análise do coordenador.');
      close();
      onSubmitted?.();
    } catch (error: any) {
      Alert.alert('Erro ao enviar', error?.message || 'Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Nova Submissão</Text>
              <Text style={styles.subtitle}>Título da atividade *</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={close}>
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* TÍTULO */}
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Curso de Python Avançado"
              placeholderTextColor="#9CA3AF"
            />

            {/* CATEGORIA */}
            <Text style={styles.label}>Categoria *</Text>
            <View style={styles.categoryRow}>
              {categorias.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.category, categoria === item && styles.categoryActive]}
                  onPress={() => setCategoria(item)}
                >
                  <Text style={[styles.categoryText, categoria === item && styles.categoryTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* CURSO */}
            <Text style={styles.label}>Curso *</Text>
            <TouchableOpacity
              style={styles.cursoSelector}
              onPress={() => setCursoAberto(!cursoAberto)}
              activeOpacity={0.8}
            >
              <Text style={[styles.cursoSelectorTexto, !curso && { color: '#9CA3AF' }]}>
                {curso || 'Selecione seu curso'}
              </Text>
              <Ionicons
                name={cursoAberto ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#6B7280"
              />
            </TouchableOpacity>

            {cursoAberto && (
              <View style={styles.cursoDropdown}>
                {cursos.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.cursoItem, curso === c && styles.cursoItemAtivo]}
                    onPress={() => { setCurso(c); setCursoAberto(false); }}
                  >
                    <Text style={[styles.cursoItemTexto, curso === c && styles.cursoItemTextoAtivo]}>
                      {c}
                    </Text>
                    {curso === c && (
                      <Ionicons name="checkmark" size={16} color="#1E3A8A" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* HORAS */}
            <Text style={styles.label}>Quantidade de horas *</Text>
            <TextInput
              style={styles.input}
              value={horas}
              onChangeText={setHoras}
              placeholder="Ex: 40"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />

            {/* DESCRIÇÃO */}
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.inputMultilinha]}
              placeholder="Descreva brevemente a atividade realizada..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* ARQUIVO */}
            <Text style={styles.label}>Documento comprobatório *</Text>
            <TouchableOpacity style={styles.fileBox} onPress={pickFile} activeOpacity={0.8}>
              <Ionicons name="cloud-upload-outline" size={28} color="#1E3A8A" />
              <Text style={styles.fileText}>
                {file?.name || 'Selecionar arquivo'}
              </Text>
              <Text style={styles.fileSub}>PDF, imagem ou Word</Text>
            </TouchableOpacity>

            {/* BOTÃO ENVIAR */}
            <TouchableOpacity
              style={[styles.submitButton, loading && { opacity: 0.7 }]}
              onPress={submit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="send-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.submitText}>Enviar para análise</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  closeButton: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center',
  },
  label: {
    fontSize: 13, fontWeight: '600',
    color: '#374151', marginBottom: 8, marginTop: 4,
  },
  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#111827',
    backgroundColor: '#F9FAFB', marginBottom: 14,
  },
  inputMultilinha: { height: 90, paddingTop: 12 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  category: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 14,
    backgroundColor: '#F9FAFB',
  },
  categoryActive: { backgroundColor: '#1E3A8A', borderColor: '#1E3A8A' },
  categoryText: { color: '#6B7280', fontSize: 13, fontWeight: '700' },
  categoryTextActive: { color: '#FFFFFF' },
  cursoSelector: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: '#F9FAFB', marginBottom: 6,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cursoSelectorTexto: { fontSize: 15, color: '#111827', flex: 1 },
  cursoDropdown: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
    backgroundColor: '#FFFFFF', marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
    overflow: 'hidden',
  },
  cursoItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  cursoItemAtivo: { backgroundColor: '#EFF6FF' },
  cursoItemTexto: { fontSize: 14, color: '#374151' },
  cursoItemTextoAtivo: { color: '#1E3A8A', fontWeight: '700' },
  fileBox: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: '#BFDBFE',
    borderRadius: 14, padding: 20, alignItems: 'center',
    backgroundColor: '#EFF6FF', marginBottom: 16, gap: 6,
  },
  fileText: { fontSize: 14, fontWeight: '700', color: '#1E3A8A', textAlign: 'center' },
  fileSub: { fontSize: 12, color: '#6B7280' },
  submitButton: {
    backgroundColor: '#2563EB', borderRadius: 14,
    paddingVertical: 16, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});