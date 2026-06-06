import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';

type Atividade = {
  id: string;
  titulo: string;
  categoria: string;
  data: string;
  horas: string;
  status: 'Aprovado' | 'Indeferida' | 'Pendente' | 'Em Análise';
  motivoRecusa?: string;
};

const atividades: Atividade[] = [
  { id: 'SER13312', titulo: 'Senac Confia', categoria: 'Extensão', data: '11/05/2026', horas: '10h', status: 'Aprovado' },
  { id: 'SER13313', titulo: 'Curso Python avançado', categoria: 'Ensino', data: '25/08/2025', horas: '10h', status: 'Indeferida', motivoRecusa: 'Documentação incompleta' },
  { id: 'SER13314', titulo: 'Projeto Banco de Dados Firebase', categoria: 'Extensão', data: '14/05/2026', horas: '20h', status: 'Aprovado' },
  { id: 'SER13315', titulo: 'Um Grande Projeto Nacional', categoria: 'Extensão', data: '22/11/2022', horas: '1231h', status: 'Aprovado' },
  { id: 'SER13316', titulo: 'Documentação', categoria: 'Extensão', data: '22/03/2022', horas: '13h', status: 'Pendente' },
];

const abas = ['Todas', 'Aprovado', 'Indeferida', 'Pendente', 'Em Análise'];

const statusConfig: Record<string, { bg: string; texto: string; cor: string }> = {
  Aprovado:     { bg: '#D1FAE5', texto: 'Aprovado',    cor: '#065F46' },
  Indeferida:   { bg: '#FEE2E2', texto: 'Indeferida',  cor: '#991B1B' },
  Pendente:     { bg: '#FEF9C3', texto: 'Pendente',    cor: '#92400E' },
  'Em Análise': { bg: '#DBEAFE', texto: 'Em Análise',  cor: '#1E40AF' },
};

export default function RelatorioScreen() {
  const navigation = useNavigation<any>();
  const [abaAtiva, setAbaAtiva] = useState('Todas');

  const totalHoras = atividades.filter(a => a.status === 'Aprovado').reduce((acc, a) => acc + parseInt(a.horas), 0);
  const aprovadas = atividades.filter(a => a.status === 'Aprovado').length;
  const pendentes = atividades.filter(a => a.status === 'Pendente' || a.status === 'Em Análise').length;
  const filtradas = abaAtiva === 'Todas' ? atividades : atividades.filter(a => a.status === abaAtiva);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      <View style={styles.headerAzul}>
        <View style={styles.linhaSuperior}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Histórico Completo</Text>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.headerSubtitulo}>Todas as atividades submetidas</Text>
      </View>

      <View style={styles.resumoContainer}>
        {[
          { icone: 'list-outline', numero: atividades.length, label: 'Registros' },
          { icone: 'time-outline', numero: `${totalHoras}h`, label: 'Horas lançadas' },
          { icone: 'hourglass-outline', numero: pendentes, label: 'Pendentes' },
        ].map((item, i) => (
          <View key={i} style={styles.cardResumo}>
            <Ionicons name={item.icone as any} size={18} color="#6B7280" style={{ marginBottom: 4 }} />
            <Text style={styles.resumoNumero}>{item.numero}</Text>
            <Text style={styles.resumoLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.abasScroll} contentContainerStyle={styles.abasContainer}>
        {abas.map(aba => (
          <TouchableOpacity key={aba} style={[styles.aba, abaAtiva === aba && styles.abaAtiva]} onPress={() => setAbaAtiva(aba)}>
            <Text style={[styles.abaTexto, abaAtiva === aba && styles.abaTextoAtivo]}>{aba}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
        <View style={styles.listaCabecalho}>
          <Text style={styles.listaTitulo}>Timeline de atividades</Text>
          <Text style={styles.listaSubtitulo}>{aprovadas} aprovadas · {atividades.filter(a => a.status === 'Indeferida').length} indeferidas</Text>
        </View>

        {filtradas.map((item, index) => {
          const cfg = statusConfig[item.status];
          return (
            <View key={index} style={styles.cardAtividade}>
              <View style={styles.atividadeLinha}>
                <View style={styles.atividadeIcone}>
                  <Ionicons name="document-text-outline" size={18} color="#1E3A8A" />
                </View>
                <View style={styles.atividadeInfo}>
                  <Text style={styles.atividadeTitulo}>{item.titulo}</Text>
                  <Text style={styles.atividadeCategoria}>{item.categoria}</Text>
                  <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.badgeTexto, { color: cfg.cor }]}>{cfg.texto}</Text>
                  </View>
                  {item.motivoRecusa && (
                    <View style={styles.motivoContainer}>
                      <Text style={styles.motivoTexto}>Motivo da recusa: {item.motivoRecusa}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.atividadeDireita}>
                  <Text style={styles.atividadeData}>{item.data}</Text>
                  <Text style={styles.atividadeHoras}>{item.horas}</Text>
                  <Text style={styles.atividadeCategoriaTag}>{item.categoria}</Text>
                </View>
              </View>
            </View>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>

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
  linhaSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitulo: { fontSize: 13, color: '#93C5FD', textAlign: 'center' },
  resumoContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  cardResumo: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, alignItems: 'flex-start',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  resumoNumero: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  resumoLabel: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  abasScroll: { maxHeight: 50, marginTop: 14 },
  abasContainer: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  aba: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  abaAtiva: { backgroundColor: '#1E3A8A', borderColor: '#1E3A8A' },
  abaTexto: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  abaTextoAtivo: { color: '#FFFFFF', fontWeight: '700' },
  lista: { flex: 1, paddingHorizontal: 20, marginTop: 14 },
  listaCabecalho: { marginBottom: 12 },
  listaTitulo: { fontSize: 15, fontWeight: '700', color: '#111827' },
  listaSubtitulo: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  cardAtividade: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  atividadeLinha: { flexDirection: 'row', alignItems: 'flex-start' },
  atividadeIcone: {
    backgroundColor: '#EFF6FF', width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2,
  },
  atividadeInfo: { flex: 1 },
  atividadeTitulo: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  atividadeCategoria: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  badge: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 4 },
  badgeTexto: { fontSize: 11, fontWeight: '700' },
  motivoContainer: { backgroundColor: '#FEE2E2', borderRadius: 8, padding: 8, marginTop: 4 },
  motivoTexto: { fontSize: 12, color: '#991B1B' },
  atividadeDireita: { alignItems: 'flex-end', minWidth: 70 },
  atividadeData: { fontSize: 11, color: '#9CA3AF', marginBottom: 4 },
  atividadeHoras: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  atividadeCategoriaTag: { fontSize: 11, color: '#3B82F6', fontWeight: '500' },
});