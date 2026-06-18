import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator,
  TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';

import Footer from '../components/Footer';
import { createSubmission } from '../services/firebaseRepository';
import { useAuth } from '../contexts/AuthContext';

// Categorias fixas com ícone e cor — mesmas da CargaComplementarScreen
const categorias = [
  { label: 'Ensino',   icone: 'school-outline',    cor: '#3B82F6' },
  { label: 'Extensão', icone: 'people-outline',    cor: '#10B981' },
  { label: 'Pesquisa', icone: 'briefcase-outline', cor: '#F59E0B' },
  { label: 'Outros',   icone: 'ribbon-outline',    cor: '#8B5CF6' },
];

export default function UploadScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [titulo, setTitulo]           = useState('');
  const [categoria, setCategoria]     = useState('');
  const [horas, setHoras]             = useState('');
  const [fileName, setFileName]       = useState<string | null>(null);
  const [fileUri, setFileUri]         = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/png', 'image/jpeg'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length > 0) {
        const file = result.assets[0];
        setFileName(file.name);
        setFileUri(file.uri);
        setFileMimeType(file.mimeType);
      }
    } catch {
      Alert.alert('Erro', 'Ocorreu um problema ao tentar abrir o arquivo.');
    }
  };

  const handleSubmit = async () => {
    if (!titulo.trim()) { Alert.alert('Atenção', 'Informe o título da atividade.'); return; }
    if (!categoria)     { Alert.alert('Atenção', 'Selecione uma categoria.'); return; }
    if (!horas || isNaN(Number(horas))) { Alert.alert('Atenção', 'Informe a carga horária corretamente.'); return; }
    if (Number(horas) <= 0) { Alert.alert('Atenção', 'A carga horária deve ser maior que zero.'); return; }
    if (Number(horas) > 100) { Alert.alert('Atenção', 'A carga horária máxima por atividade é de 100 horas.'); return; }    
    if (!fileUri)       { Alert.alert('Atenção', 'Selecione um arquivo comprobatório.'); return; }
    if (!user)          { Alert.alert('Erro', 'Você precisa estar logado.'); navigation.navigate('Login'); return; }
  
    try {
      setIsUploading(true);
      //@ts-ignore

      await createSubmission(user, {
        titulo,
        categoria,
        horas: Number(horas),
        file: { uri: fileUri, name: fileName!, mimeType: fileMimeType },
      });
      Alert.alert('Sucesso!', 'Atividade enviada com sucesso!', [
        { text: 'Ver relatório', onPress: () => navigation.navigate('Relatorio') },
      ]);
      setTitulo('');
      setCategoria('');
      setHoras('');
      setFileName(null);
      setFileUri(null);
    } catch (error: any) {
      Alert.alert('Erro no Envio', error.message || 'Não foi possível enviar.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={18} color="#004C94" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Nova Atividade</Text>
          <Text style={styles.subtitle}>Preencha os dados e anexe o comprovante.</Text>

          {/* TÍTULO */}
          <Text style={styles.label}>Título da atividade *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Curso de Python Avançado"
            placeholderTextColor="#9CA3AF"
            value={titulo}
            onChangeText={setTitulo}
          />

          {/* CATEGORIA — chips de seleção */}
          <Text style={styles.label}>Categoria *</Text>
          <View style={styles.categoriasGrid}>
            {categorias.map((cat) => {
              const ativo = categoria === cat.label;
              return (
                <TouchableOpacity
                  key={cat.label}
                  style={[
                    styles.categoriaChip,
                    { borderColor: cat.cor },
                    ativo && { backgroundColor: cat.cor },
                  ]}
                  onPress={() => setCategoria(cat.label)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={cat.icone as any}
                    size={16}
                    color={ativo ? '#FFFFFF' : cat.cor}
                  />
                  <Text style={[
                    styles.categoriaChipTexto,
                    { color: ativo ? '#FFFFFF' : cat.cor },
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
  <TextInput
     style={styles.input}
     placeholder="Máx. 100h"
     placeholderTextColor="#9CA3AF"
     keyboardType="numeric"
    maxLength={3}
    value={horas}
    onChangeText={(v) => {
    const num = Number(v);
    if (v === '' || (num >= 0 && num <= 100)) setHoras(v);
  }}
/>

          {/* ARQUIVO */}
          <Text style={styles.label}>Documento comprobatório *</Text>
          <TouchableOpacity style={styles.fileBox} onPress={handlePickFile} activeOpacity={0.8}>
            <Ionicons
              name={fileUri ? 'document-attach' : 'cloud-upload-outline'}
              size={28}
              color="#004C94"
            />
            <Text style={styles.fileBoxTexto}>
              {fileName || 'Selecionar arquivo'}
            </Text>
            <Text style={styles.fileBoxSub}>PDF, PNG ou JPEG</Text>
          </TouchableOpacity>

          {/* BOTÃO ENVIAR */}
          <TouchableOpacity
            style={[styles.submitButton, (!fileUri || isUploading) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!fileUri || isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="send-outline" size={18} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Enviar Atividade</Text>
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { padding: 24, paddingBottom: 32 },
  backButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', marginBottom: 20,
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 8, backgroundColor: '#EFF6FF',
  },
  backButtonText: { fontSize: 15, color: '#004C94', fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2D3748', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#718096', textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2E8F0',
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 15, color: '#2D3748', marginBottom: 16,
  },

  // Chips de categoria
  categoriasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  categoriaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1.5, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  categoriaChipTexto: { fontSize: 13, fontWeight: '700' },

  // Arquivo
  fileBox: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: '#BFDBFE',
    borderRadius: 12, padding: 20, alignItems: 'center',
    backgroundColor: '#EFF6FF', marginBottom: 24, gap: 6,
  },
  fileBoxTexto: { fontSize: 14, fontWeight: '700', color: '#004C94', textAlign: 'center' },
  fileBoxSub: { fontSize: 12, color: '#6B7280' },

  // Botão enviar
  submitButton: {
    backgroundColor: '#004C94', paddingVertical: 16, borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  submitButtonDisabled: { backgroundColor: '#A0AEC0' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});