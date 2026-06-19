import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';
import { listStudentSubmissions } from '../services/firebaseRepository';
import { Submission, SubmissionStatus } from '../models/Submission';
import Footer from '../components/Footer';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

type AbaFiltro = 'Todas' | SubmissionStatus;

const ABAS: AbaFiltro[] = ['Todas', 'APROVADO', 'REPROVADO', 'PENDENTE'];
//@ts-ignore
const LABEL_ABA: Record<AbaFiltro, string> = {
  Todas:     'Todas',
  APROVADO:  'Aprovado',
  REPROVADO: 'Reprovado',
  PENDENTE:  'Pendente',
};

type StatusConfig = {
  bg:     string;
  texto:  string;
  cor:    string;
  icone:  string;
};

//@ts-ignore
const STATUS_CONFIG: Record<SubmissionStatus, StatusConfig> = {
  APROVADO:   { bg: '#D1FAE5', texto: 'Aprovado',   cor: '#065F46', icone: 'checkmark-circle-outline' },
  REPROVADO:  { bg: '#FEE2E2', texto: 'Reprovado',  cor: '#991B1B', icone: 'close-circle-outline'     },
  PENDENTE:   { bg: '#FEF9C3', texto: 'Pendente',   cor: '#92400E', icone: 'time-outline'              }
};

const STATUS_FALLBACK: StatusConfig = STATUS_CONFIG['PENDENTE'];

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS LOCAIS
// ─────────────────────────────────────────────────────────────────────────────

function useAtividades() {
  const { user } = useAuth();
  const [atividades, setAtividades] = useState<Submission[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      let cancelado = false;

      async function carregar() {
        try {
          setCarregando(true);
          const dados = await listStudentSubmissions(user!);
          if (!cancelado) setAtividades(dados);
        } catch (e) {
          console.error('[RelatorioScreen] Erro ao carregar atividades:', e);
        } finally {
          if (!cancelado) setCarregando(false);
        }
      }

      carregar();
      return () => { cancelado = true; };
    }, [user])
  );

  return { atividades, carregando };
}

function useTotais(atividades: Submission[]) {
  const totalHoras = atividades
    .filter(a => a.status === 'APROVADO')
    .reduce((acc, a) => acc + (a.horasAprovadas || a.horasInformadas || 0), 0);

  const aprovadas  = atividades.filter(a => a.status === 'APROVADO').length;
  const pendentes  = atividades.filter(a => a.status === 'PENDENTE').length;
  const reprovadas = atividades.filter(a => a.status === 'REPROVADO').length;

  return { totalHoras, aprovadas, pendentes, reprovadas };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTES
// ─────────────────────────────────────────────────────────────────────────────

type CardResumoItem = { icone: string; numero: string | number; label: string };

function CardResumo({ icone, numero, label }: CardResumoItem) {
  return (
    <View style={styles.cardResumo}>
      <Ionicons name={icone as any} size={18} color="#6B7280" style={{ marginBottom: 4 }} />
      <Text style={styles.resumoNumero}>{numero}</Text>
      <Text style={styles.resumoLabel}>{label}</Text>
    </View>
  );
}

function AbaFiltroButton({
  aba,
  ativa,
  onPress,
}: {
  aba: AbaFiltro;
  ativa: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.aba, ativa && styles.abaAtiva]}
      onPress={onPress}
    >
      <Text style={[styles.abaTexto, ativa && styles.abaTextoAtivo]}>
        {LABEL_ABA[aba]}
      </Text>
    </TouchableOpacity>
  );
}

function CardAtividade({
  item,
  onPress,
}: {
  item: Submission;
  onPress: () => void;
}) {
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_FALLBACK;

  return (
    <TouchableOpacity
      style={styles.cardAtividade}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={styles.atividadeLinha}>
        <View style={styles.atividadeIcone}>
          <Ionicons name="document-text-outline" size={18} color="#004C94" />
        </View>

        <View style={styles.atividadeInfo}>
          <Text style={styles.atividadeTitulo}>{item.titulo}</Text>
          <Text style={styles.atividadeCategoria}>{item.categoria}</Text>

          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeTexto, { color: cfg.cor }]}>{cfg.texto}</Text>
          </View>

          {item.justificativaCoordenador ? (
            <View style={styles.motivoContainer}>
              <Text style={styles.motivoTexto}>Motivo: {item.justificativaCoordenador}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.atividadeDireita}>
          <Text style={styles.atividadeData}>{item.dataEnvio}</Text>
          <Text style={styles.atividadeHoras}>{item.horasInformadas}h</Text>
          <Text style={styles.atividadeCategoriaTag}>{item.categoria}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function InfoItem({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  );
}

function ModalDetalhes({
  atividade,
  visivel,
  onFechar,
}: {
  atividade: Submission | null;
  visivel: boolean;
  onFechar: () => void;
}) {
  if (!atividade) return null;

  const cfg = STATUS_CONFIG[atividade.status] ?? STATUS_FALLBACK;

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      transparent
      onRequestClose={onFechar}
    >
      <Pressable style={styles.modalOverlay} onPress={onFechar}>
        <Pressable style={styles.modalContainer} onPress={() => {}}>
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <View style={styles.modalIcone}>
              <Ionicons name="document-text-outline" size={24} color="#004C94" />
            </View>
            <TouchableOpacity onPress={onFechar} style={styles.modalFechar}>
              <Ionicons name="close" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalTitulo}>{atividade.titulo}</Text>

          <View style={[styles.badgeModal, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icone as any} size={13} color={cfg.cor} style={{ marginRight: 4 }} />
            <Text style={[styles.badgeModalTexto, { color: cfg.cor }]}>{cfg.texto}</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.infoGrid}>
            <InfoItem label="Código"           valor={atividade.id} />
            <InfoItem label="Data"             valor={atividade.dataEnvio} />
            <InfoItem label="Categoria"        valor={atividade.categoria} />
            <InfoItem label="Horas informadas" valor={`${atividade.horasInformadas}h`} />
            {atividade.horasAprovadas > 0 && (
              <InfoItem label="Horas aprovadas" valor={`${atividade.horasAprovadas}h`} />
            )}
          </View>

          {atividade.justificativaCoordenador ? (
            <View style={styles.motivoModalContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color="#991B1B"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.motivoModalTexto}>
                Motivo: {atividade.justificativaCoordenador}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.btnFechar} onPress={onFechar}>
            <Text style={styles.btnFecharTexto}>Fechar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TELA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export default function RelatorioScreen() {
  const navigation = useNavigation<any>();

  const { atividades, carregando }                       = useAtividades();
  const { totalHoras, aprovadas, pendentes, reprovadas } = useTotais(atividades);

  const [abaAtiva, setAbaAtiva]                           = useState<AbaFiltro>('Todas');
  const [atividadeSelecionada, setAtividadeSelecionada]   = useState<Submission | null>(null);
  const [modalVisivel, setModalVisivel]                   = useState(false);

  const atividadesFiltradas =
    abaAtiva === 'Todas'
      ? atividades
      : atividades.filter(a => a.status === abaAtiva);

  function abrirDetalhes(item: Submission) {
    setAtividadeSelecionada(item);
    setModalVisivel(true);
  }

  function fecharModal() {
    setModalVisivel(false);
    setAtividadeSelecionada(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004C94" />

      <View style={styles.container}>
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
          <CardResumo icone="list-outline"      numero={atividades.length} label="Registros"       />
          <CardResumo icone="time-outline"      numero={`${totalHoras}h`}  label="Horas aprovadas" />
          <CardResumo icone="hourglass-outline" numero={pendentes}         label="Pendentes"        />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.abasScroll}
          contentContainerStyle={styles.abasContainer}
        >
          {ABAS.map(aba => (
            <AbaFiltroButton
              key={aba}
              aba={aba}
              ativa={abaAtiva === aba}
              onPress={() => setAbaAtiva(aba)}
            />
          ))}
        </ScrollView>

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#004C94" />
            <Text style={styles.loadingTexto}>Carregando atividades...</Text>
          </View>
        ) : (
          <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
            <View style={styles.listaCabecalho}>
              <Text style={styles.listaTitulo}>Timeline de atividades</Text>
              <Text style={styles.listaSubtitulo}>
                {aprovadas} aprovadas · {reprovadas} reprovadas
              </Text>
            </View>

            {atividadesFiltradas.length === 0 ? (
              <View style={styles.vazioContainer}>
                <Ionicons name="document-outline" size={48} color="#D1D5DB" />
                <Text style={styles.vazioTexto}>Nenhuma atividade encontrada</Text>
              </View>
            ) : (
              atividadesFiltradas.map((item, index) => (
                <CardAtividade
                  key={item.id || index}
                  item={item}
                  onPress={() => abrirDetalhes(item)}
                />
              ))
            )}

            <View style={{ height: 20 }} />
          </ScrollView>
        )}

        <Footer />
      </View>

      <ModalDetalhes
        atividade={atividadeSelecionada}
        visivel={modalVisivel}
        onFechar={fecharModal}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:           { flex: 1, backgroundColor: '#F3F4F6' },
  headerAzul: {
    backgroundColor: '#004C94',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  linhaSuperior:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  headerTitulo:        { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitulo:     { fontSize: 13, color: '#93C5FD', textAlign: 'center' },
  resumoContainer:     { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  cardResumo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  resumoNumero:        { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  resumoLabel:         { fontSize: 11, color: '#6B7280', marginTop: 2 },
  abasScroll:          { maxHeight: 50, marginTop: 14 },
  abasContainer:       { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  aba:                 { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  abaAtiva:            { backgroundColor: '#004C94', borderColor: '#004C94' },
  abaTexto:            { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  abaTextoAtivo:       { color: '#FFFFFF', fontWeight: '700' },
  loadingContainer:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingTexto:        { fontSize: 14, color: '#6B7280' },
  vazioContainer:      { alignItems: 'center', paddingTop: 60, gap: 12 },
  vazioTexto:          { fontSize: 15, color: '#9CA3AF' },
  lista:               { flex: 1, paddingHorizontal: 20, marginTop: 14 },
  listaCabecalho:      { marginBottom: 12 },
  listaTitulo:         { fontSize: 15, fontWeight: '700', color: '#111827' },
  listaSubtitulo:      { fontSize: 12, color: '#6B7280', marginTop: 2 },
  cardAtividade: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  atividadeLinha:       { flexDirection: 'row', alignItems: 'flex-start' },
  atividadeIcone: {
    backgroundColor: '#EFF6FF',
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  atividadeInfo:         { flex: 1 },
  atividadeTitulo:       { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  atividadeCategoria:    { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  badge:                 { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 4 },
  badgeTexto:            { fontSize: 11, fontWeight: '700' },
  motivoContainer:       { backgroundColor: '#FEE2E2', borderRadius: 8, padding: 8, marginTop: 4 },
  motivoTexto:           { fontSize: 12, color: '#991B1B' },
  atividadeDireita:      { alignItems: 'flex-end', minWidth: 70 },
  atividadeData:         { fontSize: 11, color: '#9CA3AF', marginBottom: 4 },
  atividadeHoras:        { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  atividadeCategoriaTag: { fontSize: 11, color: '#3B82F6', fontWeight: '500' },
  modalOverlay:          { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalContainer:        { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  modalHandle:           { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeader:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalIcone:            { backgroundColor: '#EFF6FF', width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  modalFechar:           { backgroundColor: '#F3F4F6', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  modalTitulo:           { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  badgeModal:            { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 16 },
  badgeModalTexto:       { fontSize: 13, fontWeight: '700' },
  divisor:               { height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 },
  infoGrid:              { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 16 },
  infoItem:              { width: '45%' },
  infoLabel:             { fontSize: 11, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase', marginBottom: 3 },
  infoValor:             { fontSize: 14, fontWeight: '600', color: '#111827' },
  motivoModalContainer:  { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FEE2E2', borderRadius: 10, padding: 12, marginBottom: 20 },
  motivoModalTexto:      { fontSize: 13, color: '#991B1B', flex: 1, lineHeight: 18 },
  btnFechar:             { backgroundColor: '#004C94', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnFecharTexto:        { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});