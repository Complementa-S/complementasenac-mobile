import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../contexts/AuthContext';
import { logoutFirebase, listStudentSubmissions } from '../services/firebaseRepository';
import { Submission } from '../models/Submission';

import Header from '../components/Header';
import Footer from '../components/Footer';

const statusConfig: Record<string, { cor: string; texto: string; icone: any }> = {
  APROVADO:   { cor: '#004C94', texto: 'Aprovado',   icone: 'checkmark-circle' },
  REPROVADO:  { cor: '#DC2626', texto: 'Reprovado',  icone: 'close-circle'     },
  INDEFERIDO: { cor: '#DC2626', texto: 'Indeferido', icone: 'close-circle'     },
  PENDENTE:   { cor: '#D97706', texto: 'Em análise', icone: 'time'             },
};

export default function DashboardScreen() {
  const { user, setUser } = useAuth();
  if (!user) return null;

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [ultimasSubs, setUltimasSubs] = useState<Submission[]>([]);
  const [horasConcluidas, setHorasConcluidas] = useState(0);
  const [atividadesAprovadas, setAtividadesAprovadas] = useState(0);

  const horasTotal = 100;

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        if (!user) return;
        try {
          const dados = await listStudentSubmissions(user);

          const aprovadas = dados.filter(s => s.status === 'APROVADO');
          const totalHoras = aprovadas.reduce(
            (acc, s) => acc + (s.horasAprovadas || s.horasInformadas || 0), 0
          );
          setHorasConcluidas(totalHoras);
          setAtividadesAprovadas(aprovadas.length);
          setUltimasSubs(dados.slice(0, 3));
        } catch (e) {
          console.error(e);
        }
      }
      carregar();
    }, [user])
  );

  const percentual = Math.min(Math.round((horasConcluidas / horasTotal) * 100), 100);
  const status = horasConcluidas >= horasTotal ? 'Concluído' : 'Em progresso';

  const handleLogout = async () => {
    await logoutFirebase();
    setUser(null);
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#004C94" />

        <View style={styles.headerAzul}>
          <Header />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* CARD CARGA COMPLEMENTAR */}
          <View style={styles.cardWrapper}>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('CargaComplementar')}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitulo}>Carga complementar</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeTexto}>{status}</Text>
                </View>
              </View>
              <View style={styles.horasRow}>
                <Text style={styles.horasNumero}>{horasConcluidas}</Text>
                <Text style={styles.horasTotal}>/{horasTotal}h</Text>
              </View>
              <View style={styles.barraFundo}>
                <View style={[styles.barraPreenchida, { width: `${percentual}%` as any }]} />
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.footerTexto}>{percentual}% concluído</Text>
                <Text style={styles.footerTexto}>{atividadesAprovadas} atividades aprovadas</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* CARD ÚLTIMOS CERTIFICADOS */}
          {ultimasSubs.length > 0 && (
            <View style={styles.cardWrapper}>
              <View style={styles.card}>
                <View style={styles.ultimosHeader}>
                  <Text style={styles.ultimosTitulo}>Últimos Certificados</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Relatorio')}>
                    <Text style={styles.ultimosVerTodos}>Ver todos</Text>
                  </TouchableOpacity>
                </View>

                {ultimasSubs.map((sub, i) => {
                  const statusKey = sub.status?.toUpperCase() ?? 'PENDENTE';
                  const cfg = statusConfig[statusKey] ?? statusConfig['PENDENTE'];
                  return (
                    <View
                      key={sub.id || i}
                      style={[
                        styles.certLinha,
                        i < ultimasSubs.length - 1 && styles.certSeparador,
                      ]}
                    >
                      <View style={styles.certEsquerda}>
                        <Text style={styles.certNome} numberOfLines={1}>
                          {sub.titulo || 'Atividade complementar'}
                        </Text>
                        <Text style={styles.certCategoria}>
                          {sub.categoria || 'Sem categoria'}
                        </Text>
                      </View>
                      <Text style={styles.certHoras}>{sub.horasInformadas}h</Text>
                      <View style={styles.certStatusContainer}>
                        <Text style={[styles.certStatus, { color: cfg.cor }]}>
                          {cfg.texto}
                        </Text>
                        <Ionicons name={cfg.icone} size={16} color={cfg.cor} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerAzul: {
    backgroundColor: '#004C94',
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  scrollContent: { paddingBottom: 8 },
  cardWrapper: { paddingHorizontal: 20, marginTop: 20 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  cardTitulo: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  badge: { backgroundColor: '#EFF6FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeTexto: { fontSize: 12, color: '#004C94', fontWeight: '600' },
  horasRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 14 },
  horasNumero: { fontSize: 40, fontWeight: 'bold', color: '#111827', lineHeight: 44 },
  horasTotal: { fontSize: 18, color: '#6B7280', marginBottom: 4, marginLeft: 2 },
  barraFundo: {
    height: 8, backgroundColor: '#E5E7EB',
    borderRadius: 4, overflow: 'hidden', marginBottom: 12,
  },
  barraPreenchida: { height: '100%', backgroundColor: '#004C94', borderRadius: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  footerTexto: { fontSize: 12, color: '#6B7280' },

  // Últimos certificados
  ultimosHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  ultimosTitulo: { fontSize: 15, fontWeight: '700', color: '#111827' },
  ultimosVerTodos: { fontSize: 13, color: '#004C94', fontWeight: '600' },
  certLinha: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  certSeparador: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  certEsquerda: { flex: 1 },
  certNome: { fontSize: 14, color: '#111827', fontWeight: '500' },
  certCategoria: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  certHoras: { fontSize: 14, color: '#6B7280', marginHorizontal: 12, fontWeight: '500' },
  certStatusContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  certStatus: { fontSize: 13, fontWeight: '600' },
});