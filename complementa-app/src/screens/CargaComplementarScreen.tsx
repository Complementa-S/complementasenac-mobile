import React from 'react';
import { StyleSheet, Text, View, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

export default function CargaComplementarScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      <View style={styles.headerAzul}>
        <View style={styles.linhaSuperior}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Carga Complementar</Text>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={styles.cardStatus}>
          <View style={styles.cardStatusTopo}>
            <Text style={styles.cardStatusTitulo}>Carga complementar</Text>
            <View style={styles.badgeProgresso}>
              <Text style={styles.badgeProgressoTexto}>Em progresso</Text>
            </View>
          </View>
          <Text style={styles.horasTexto}>
            <Text style={styles.horasNumero}>0</Text>
            <Text style={styles.horasTotal}>/200h</Text>
          </Text>
          <View style={styles.barraFundo}>
            <View style={[styles.barraPreenchida, { width: '0%' }]} />
          </View>
          <View style={styles.cardStatusRodape}>
            <Text style={styles.percentualTexto}>0% concluído</Text>
            <Text style={styles.atividadesTexto}>0 atividades aprovadas</Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>Categorias</Text>

        {[
          { icone: 'school-outline', cor: '#3B82F6', titulo: 'Ensino', horas: '0h', total: '60h' },
          { icone: 'people-outline', cor: '#10B981', titulo: 'Extensão', horas: '0h', total: '80h' },
          { icone: 'briefcase-outline', cor: '#F59E0B', titulo: 'Pesquisa', horas: '0h', total: '40h' },
          { icone: 'ribbon-outline', cor: '#8B5CF6', titulo: 'Outros', horas: '0h', total: '20h' },
        ].map((item, index) => (
          <View key={index} style={styles.cardCategoria}>
            <View style={[styles.categoriaIcone, { backgroundColor: item.cor + '20' }]}>
              <Ionicons name={item.icone as any} size={22} color={item.cor} />
            </View>
            <View style={styles.categoriaInfo}>
              <Text style={styles.categoriaTitulo}>{item.titulo}</Text>
              <View style={styles.miniBarraFundo}>
                <View style={[styles.miniBarraPreenchida, { width: '0%', backgroundColor: item.cor }]} />
              </View>
            </View>
            <View style={styles.categoriaHoras}>
              <Text style={[styles.categoriaHorasNumero, { color: item.cor }]}>{item.horas}</Text>
              <Text style={styles.categoriaHorasTotal}>/{item.total}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.botaoSubmissao}>
          <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.botaoSubmissaoTexto}>Nova Submissão</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerAzul: {
    backgroundColor: '#1E3A8A',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  linhaSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  scrollView: { flex: 1, padding: 20 },
  cardStatus: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  cardStatusTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardStatusTitulo: { fontSize: 14, color: '#6B7280' },
  badgeProgresso: { backgroundColor: '#EFF6FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeProgressoTexto: { fontSize: 12, color: '#1E3A8A', fontWeight: '600' },
  horasTexto: { marginBottom: 14 },
  horasNumero: { fontSize: 36, fontWeight: 'bold', color: '#111827' },
  horasTotal: { fontSize: 18, color: '#6B7280' },
  barraFundo: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 12 },
  barraPreenchida: { height: 8, backgroundColor: '#1E3A8A', borderRadius: 4 },
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
  botaoSubmissao: {
    backgroundColor: '#1E3A8A', borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8,
  },
  botaoSubmissaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});