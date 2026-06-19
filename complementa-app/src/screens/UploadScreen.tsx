import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';

import Footer from '../components/Footer';
import { createSubmission } from '../services/firebaseRepository';
import { useAuth } from '../contexts/AuthContext'; // 👈 usa o usuário já logado

export default function UploadScreen() {
  const { user } = useAuth(); // 👈 pega o usuário logado
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [titulo, setTitulo] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [horas, setHoras] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handlePickFile = async (): Promise<void> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/png'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFileName(file.name);
        setFileUri(file.uri);
        setFileMimeType(file.mimeType);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um problema ao tentar abrir o arquivo.");
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!titulo || !categoria || !horas || !fileUri) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos e selecione um arquivo.");
      return;
    }

    // 👇 Se não há usuário logado, bloqueia
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado para enviar uma atividade.");
      navigation.navigate('Login');
      return;
    }

    try {
      setIsUploading(true);
      //@ts-ignore
      // 👇 Usa o usuário logado, sem login hardcoded
      const resposta = await createSubmission(user, {
        titulo,
        categoria,
        horas: Number(horas),
        file: {
        uri: fileUri,
        name: fileName!,
          mimeType: fileMimeType,
        },
      });

  Alert.alert("Sucesso!", "Atividade enviada com sucesso!", [
  { text: "Ver relatório", onPress: () => navigation.navigate('Relatorio') }
    ]);
      setTitulo('');
      setCategoria('');
      setHoras('');
      setFileName(null);
      setFileUri(null);

    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro no Envio", error.message || "Não foi possível enviar para o servidor.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Nova Atividade</Text>
          <Text style={styles.subtitle}>Preencha os dados e anexe o comprovante.</Text>

          <TextInput
            style={styles.input}
            placeholder="Título da Atividade"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={styles.input}
            placeholder="Categoria (ex: Extensão, Pesquisa)"
            value={categoria}
            onChangeText={setCategoria}
          />
          <TextInput
            style={styles.input}
            placeholder="Carga Horária (apenas números)"
            keyboardType="numeric"
            value={horas}
            onChangeText={setHoras}
          />

          <View style={styles.fileBox}>
            {fileName
              ? <Text style={styles.fileName}>{fileName}</Text>
              : <Text style={styles.placeholderText}>Nenhum arquivo selecionado</Text>
            }
          </View>

          <TouchableOpacity
            style={styles.pickButton}
            onPress={handlePickFile}
            disabled={isUploading}
          >
            <Text style={styles.pickButtonText}>Escolher Arquivo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, (!fileUri || isUploading) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!fileUri || isUploading}
          >
            {isUploading
              ? <ActivityIndicator color="#FFFFFF" />
              : <Text style={styles.submitButtonText}>Enviar Atividade</Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { padding: 24, justifyContent: 'center' },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EDF2F7',
  },
  backButtonText: { fontSize: 15, color: '#2B6CB0', fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2D3748', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#718096', textAlign: 'center', marginBottom: 24 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 16,
  },
  fileBox: { backgroundColor: '#EDF2F7', borderWidth: 1, borderColor: '#CBD5E0', borderStyle: 'dashed', borderRadius: 8, padding: 24, alignItems: 'center', marginBottom: 24 },
  fileName: { fontSize: 16, color: '#2B6CB0', fontWeight: '600', textAlign: 'center' },
  placeholderText: { fontSize: 16, color: '#A0AEC0' },
  pickButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#2B6CB0', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  pickButtonText: { color: '#2B6CB0', fontSize: 16, fontWeight: 'bold' },
  submitButton: { backgroundColor: '#2B6CB0', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: '#A0AEC0' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});