import React, { useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, StatusBar, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { listStudentSubmissions } from '../services/firebaseRepository';
import { Submission } from '../models/Submission';

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

const statusConfig: Record<string, { bg: string; cor: string; texto: string }> = {
  APROVADO:  { bg: '#D1FAE5', cor: '#065F46', texto: 'Aprovado'  },
  REPROVADO: { bg: '#FEE2E2', cor: '#991B1B', texto: 'Reprovado' },
  PENDENTE:  { bg: '#FEF9C3', cor: '#92400E', texto: 'Pendente'  },
};

export default function CargaComplementarScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [atividades, setAtividades] = useState<Submission[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        if (!user) return;
        try {
          setCarregando(true);
          const dados = await listStudentSubmissions(user);
          setAtividades(dados);
        } catch (e) {
          console.error(e);
        } finally {
          setCarregando(false);
        }
      }
      carregar();
    }, [user])
  );

  const totalHorasAprovadas = atividades
    .filter(s => s.status === 'APROVADO')
    .reduce((acc, s) => acc + (s.horasAprovadas || s.horasInformadas || 0), 0);

  const percentual = Math.min((totalHorasAprovadas / 200) * 100, 100).toFixed(0);

  const atividadesAprovadas = atividades.filter(s => s.status === 'APROVADO').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#004C94" />

        <View style={styles.headerAzul}>
          <View style={styles.linhaSuperior}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitulo}>Carga Complementar</Text>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </View>
        </View>

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#004C94" />
            <Text style={styles.loadingTexto}>Carregando dados...</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

            {/* CARD STATUS GERAL */}
            <View style={styles.cardStatus}>
              <View style={styles.cardStatusTopo}>
                <Text style={styles.cardStatusTitulo}>Carga complementar</Text>
                <View style={styles.badgeProgresso}>
                  <Text style={styles.badgeProgressoTexto}>Em progresso</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 14 }}>
                <Text style={styles.horasNumero}>{totalHorasAprovadas}</Text>
                <Text style={styles.horasTotal}>/200h</Text>
              </View>
              <View style={styles.barraFundo}>
                <View style={[styles.barraPreenchida, { width: `${percentual}%` as any }]} />
              </View>
              <View style={styles.cardStatusRodape}>
                <Text style={styles.percentualTexto}>{percentual}% concluído</Text>
                <Text style={styles.atividadesTexto}>{atividadesAprovadas} atividades aprovadas</Text>
              </View>
            </View>

            {/* CATEGORIAS */}
            <Text style={styles.secaoTitulo}>Categorias</Text>
            {categorias.map((cat, index) => {
              const horasCat = atividades
                .filter(s => {
                  const catNorm = s.categoria?.toLowerCase();
                  return catNorm === cat.toLowerCase() && s.status === 'APROVADO';
                })
                .reduce((acc, s) => acc + (s.horasAprovadas || s.horasInformadas || 0), 0);
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
            {atividades.length > 0 && (
              <>
                <Text style={[styles.secaoTitulo, { marginTop: 8 }]}>Minhas Submissões</Text>
                {atividades.map((sub, i) => {
                  const catKey = categorias.find(c => c.toLowerCase() === sub.categoria?.toLowerCase()) || 'Outros';
                  const cor = corCategoria[catKey] || '#6B7280';
                  const icone = iconeCategoria[catKey] || 'document-outline';
                  const cfg = statusConfig[sub.status] ?? statusConfig['PENDENTE'];
                  return (
                    <View key={i} style={styles.cardSubmissao}>
                      <View style={styles.submissaoLinha}>
                        <View style={[styles.submissaoIcone, { backgroundColor: cor + '20' }]}>
                          <Ionicons name={icone} size={18} color={cor} />
                        </View>
                        <View style={styles.submissaoInfo}>
                          <Text style={styles.submissaoTitulo}>{sub.titulo}</Text>
                          <Text style={styles.submissaoMeta}>
                            {sub.categoria} · {sub.dataEnvio} · {sub.horasInformadas}h
                          </Text>
                        </View>
                        <View style={[styles.badgeStatus, { backgroundColor: cfg.bg }]}>
                          <Text style={[styles.badgeStatusTexto, { color: cfg.cor }]}>{cfg.texto}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </>
            )}

            {atividades.length === 0 && (
              <View style={styles.vazioContainer}>
                <Ionicons name="document-outline" size={48} color="#D1D5DB" />
                <Text style={styles.vazioTexto}>Nenhuma atividade enviada ainda</Text>
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>
        )}

        <Footer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerAzul: {
    backgroundColor: '#004C94', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 24,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  linhaSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingTexto: { fontSize: 14, color: '#6B7280' },
  scrollView: { flex: 1, padding: 20 },
  cardStatus: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  cardStatusTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardStatusTitulo: { fontSize: 14, color: '#6B7280' },
  badgeProgresso: { backgroundColor: '#EFF6FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeProgressoTexto: { fontSize: 12, color: '#004C94', fontWeight: '600' },
  horasNumero: { fontSize: 36, fontWeight: 'bold', color: '#111827' },
  horasTotal: { fontSize: 18, color: '#6B7280', marginBottom: 4, marginLeft: 2 },
  barraFundo: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 12 },
  barraPreenchida: { height: 8, backgroundColor: '#004C94', borderRadius: 4 },
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
  submissaoMeta: { fontSize: 11, color: '#6B7280' },
  badgeStatus: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  badgeStatusTexto: { fontSize: 11, fontWeight: '700' },
  vazioContainer: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  vazioTexto: { fontSize: 15, color: '#9CA3AF' },
});