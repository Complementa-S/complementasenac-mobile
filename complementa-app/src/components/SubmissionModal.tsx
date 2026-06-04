import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
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

export default function SubmissionModal({ visible, onClose, onSubmitted }: Props) {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Extensao');
  const [horas, setHoras] = useState('');
  const [file, setFile] = useState<PickedFile | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setTitulo('');
    setCategoria('Extensao');
    setHoras('');
    setFile(null);
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
    try {
      setLoading(true);
      await submitActivity(user, {
        titulo,
        categoria,
        horas: Number(horas.replace(',', '.')),
        file: file as PickedFile,
      });
      Alert.alert('Submissao enviada', 'Sua atividade foi enviada para analise.');
      close();
      onSubmitted?.();
    } catch (error: any) {
      Alert.alert('Nao foi possivel enviar', error?.message || 'Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Nova submissao</Text>
              <Text style={styles.subtitle}>Arquivo, atividade e horas.</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={close}>
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.fileBox} onPress={pickFile} activeOpacity={0.8}>
            <Ionicons name="document-attach-outline" size={24} color="#1E3A8A" />
            <Text style={styles.fileText} numberOfLines={2}>
              {file?.name || 'Selecionar arquivo do celular'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Nome da atividade"
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.categoryRow}>
            {['Extensao', 'Ensino', 'Pesquisa'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.category, categoria === item && styles.categoryActive]}
                onPress={() => setCategoria(item)}
              >
                <Text style={[styles.categoryText, categoria === item && styles.categoryTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            value={horas}
            onChangeText={setHoras}
            placeholder="Horas informadas"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.submitButton} onPress={submit} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitText}>Enviar atividade</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    minHeight: 88,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
  },
  fileText: { color: '#1E3A8A', fontSize: 14, fontWeight: '700', marginTop: 8, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  categoryRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  category: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  categoryActive: { backgroundColor: '#1E3A8A', borderColor: '#1E3A8A' },
  categoryText: { color: '#6B7280', fontSize: 12, fontWeight: '700' },
  categoryTextActive: { color: '#FFFFFF' },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});

