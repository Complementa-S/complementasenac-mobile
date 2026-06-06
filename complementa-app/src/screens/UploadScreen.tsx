import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
// Importação da biblioteca que acabamos de instalar
import * as DocumentPicker from 'expo-document-picker';

/* Import do "Cabeçario" de navegação */
import Footer from '../components/Footer';

export default function UploadScreen() {
  // Estados para guardar o nome e o caminho do arquivo selecionado
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);

  // Função para abrir o gerenciador de arquivos
  const handlePickFile = async (): Promise<void> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        // Tipos MIME permitidos (PDF e PNG)
        type: ['application/pdf', 'image/png'], 
        copyToCacheDirectory: true,
      });

      // Se o usuário não cancelou e selecionou um arquivo
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFileName(file.name);
        setFileUri(file.uri); // O URI é o que você vai usar para enviar para o backend depois
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um problema ao tentar abrir o arquivo.");
    }
  };

  // Função para simular o envio do arquivo
  const handleSubmit = (): void => {
    if (!fileUri) {
      Alert.alert("Atenção", "Por favor, selecione um arquivo antes de enviar.");
      return;
    }

    // Aqui entraria o código para enviar o arquivo via API (FormData)
    Alert.alert("Enviando...", `O arquivo "${fileName}" seria enviado agora.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Envio de Atividade</Text>
      <Text style={styles.subtitle}>
        Selecione um arquivo PDF ou uma imagem PNG para continuar.
      </Text>

      {/* Caixa de exibição do arquivo selecionado */}
      <View style={styles.fileBox}>
        {fileName ? (
          <Text style={styles.fileName}>{fileName}</Text>
        ) : (
          <Text style={styles.placeholderText}>Nenhum arquivo selecionado</Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.pickButton} 
        onPress={handlePickFile}
      >
        <Text style={styles.pickButtonText}>Escolher Arquivo</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.submitButton, !fileUri && styles.submitButtonDisabled]} 
        onPress={handleSubmit}
        disabled={!fileUri} // Desabilita o botão se não houver arquivo
      >
        <Text style={styles.submitButtonText}>Enviar Arquivo</Text>
      </TouchableOpacity>

    <View style={styles.restoDaTela}>
    </View>

      <Footer />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
  },
  fileBox: {
    backgroundColor: '#EDF2F7',
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  fileName: {
    fontSize: 16,
    color: '#2B6CB0',
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  pickButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2B6CB0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  pickButtonText: {
    color: '#2B6CB0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2B6CB0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /////// obs: resto de tela /////////
    restoDaTela: {
    flex: 0,
    padding: 8,
  }
});