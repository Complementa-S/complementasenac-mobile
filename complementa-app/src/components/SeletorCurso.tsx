import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



interface Curso {
  id: string;
  nome: string;
}

interface SeletorCursoProps {
  cursos: Curso[];
  cursoSelecionado: Curso | null;
  onSelecionar: (curso: Curso) => void;
}

export default function SeletorCurso({ cursos, cursoSelecionado, onSelecionar }: SeletorCursoProps) {
  const [modalVisivel, setModalVisivel] = useState(false);

  const handleSelecionar = (curso: Curso) => {
    onSelecionar(curso);
    setModalVisivel(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecione o Curso para Acessar</Text>

      {/* Botão de Disparo */}
      <TouchableOpacity 
        style={styles.botao} 
        onPress={() => setModalVisivel(true)} 
        activeOpacity={0.8}
      >
        <View style={styles.botaoConteudo}>
          <Ionicons name="school-outline" size={20} color="#1E3A8A" style={styles.iconeEsquerda} />
          <Text style={[styles.botaoTexto, !cursoSelecionado && styles.placeholder]}>
            {cursoSelecionado ? cursoSelecionado.nome : 'Escolha um dos seus cursos...'}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={18} color="#6B7280" />
      </TouchableOpacity>

      {/* Modal com a Lista de Cursos */}
      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Seus Cursos Ativos</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={22} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={cursos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const estaSelecionado = cursoSelecionado?.id === item.id;
                return (
                  <TouchableOpacity 
                    style={[styles.opcaoItem, estaSelecionado && styles.opcaoSelecionada]} 
                    onPress={() => handleSelecionar(item)}
                  >
                    <Text style={[styles.opcaoTexto, estaSelecionado && styles.opcaoTextoSelecionado]}>
                      {item.nome}
                    </Text>
                    {estaSelecionado && (
                      <Ionicons name="checkmark-circle" size={20} color="#1E3A8A" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', color: '#4B5563', marginBottom: 6 },
  botao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  botaoConteudo: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  iconeEsquerda: { marginRight: 10 },
  botaoTexto: { fontSize: 15, color: '#1F2937', fontWeight: '500' },
  placeholder: { color: '#9CA3AF', fontWeight: '400' },
  
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalConteudo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '60%',
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  modalTitulo: { fontSize: 16, fontWeight: '600', color: '#111827' },
  opcaoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#F9FAFB',
  },
  opcaoSelecionada: { backgroundColor: '#EFF6FF' },
  opcaoTexto: { fontSize: 15, color: '#4B5563', flex: 1, paddingRight: 8 },
  opcaoTextoSelecionado: { color: '#1E3A8A', fontWeight: '600' },
});
