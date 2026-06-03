import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      <View style={styles.headerAzul}>
        <View style={styles.linhaSuperior}>
          <View>
            <Text style={styles.saudacao}>Olá, Abraão</Text>
            <Text style={styles.data}>Segunda-feira, 01 Jun 2026</Text>
          </View>
          <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
        </View>

        <View style={styles.estatisticasContainer}>
          <View style={styles.colunaStat}>
            <Text style={styles.numeroStat}>08</Text>
            <Text style={styles.textoStat}>Horas{'\n'}Pendentes</Text> 
          </View>

          <View style={styles.linhaDivisoria} />

          <View style={styles.colunaStat}>
            <Text style={styles.numeroStat}>15</Text>
            <Text style={styles.textoStat}>Horas{'\n'}Em Análise</Text>
          </View>

          <View style={styles.linhaDivisoria} />

          <View style={styles.colunaStat}>
            <Text style={styles.numeroStat}>29</Text>
            <Text style={styles.textoStat}>Horas{'\n'}Concluídas</Text>
          </View>
        </View>
      </View>

      <View style={styles.cargaC}>
        <View style={styles.cardLinhaSuperior}>
          <Text style={styles.cargaCo}>Carga complementar</Text>
          <View style={styles.badgePercentual}>
            <Text style={styles.badgeTexto}>0%</Text>
          </View>
        </View>
        
        <View style={styles.cardLinhaInferior}>
          <Text style={styles.numeroest}>
            0h<Text style={styles.metaHoras}> / 200h</Text>
          </Text>
          
          <View style={styles.graficoBarras}>
            <View style={[styles.barraGrafico, { height: 10 }]} />
            <View style={[styles.barraGrafico, { height: 20 }]} />
            <View style={[styles.barraGrafico, { height: 14 }]} />
            <View style={[styles.barraGrafico, { height: 26 }]} />
            <View style={[styles.barraGrafico, { height: 18 }]} />
          </View>
        </View>
      </View>
      
      <View style={styles.statusA}>
        <Text style={styles.statA}>Status do aluno</Text>
        <Text style={styles.nomeC}>Abraão Vinícius Freitas de Melo</Text>
        <Text style={styles.curso}>Curso: Escolinha do Neymar (RUMO AO HEXA!)</Text>
        <Text style={styles.turma}>Turma: 049</Text>
      </View>

      <View style={styles.restoDaTela} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerAzul: {
    backgroundColor: '#1E3A8A',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 48,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  linhaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  saudacao: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  data: {
    fontSize: 14,
    color: '#93C5FD',
  },
  estatisticasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colunaStat: {
    alignItems: 'center',
  },
  numeroStat: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#A7F3D0',
    marginBottom: 8,
  },
  textoStat: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  linhaDivisoria: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cargaC: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 24,
    marginTop: -24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLinhaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cargaCo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  badgePercentual: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
  },
  badgeTexto: {
    color: '#0284C7',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cardLinhaInferior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  numeroest: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  metaHoras: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: 'normal',
  },
  graficoBarras: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barraGrafico: {
    width: 4,
    backgroundColor: '#3B82F6',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  statusA: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 24,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statA: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  nomeC: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  curso: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  turma: {
    fontSize: 14,
    color: '#64748B',
  },
  restoDaTela: {
    flex: 1,
  },
});