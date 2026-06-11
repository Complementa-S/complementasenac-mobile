import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext'; // Importa o nosso contexto global


export default function Header() {
    const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    });
    const dataFormatada = hoje.charAt(0).toUpperCase() + hoje.slice(1);

  // Puxamos os dados do usuário e a função de logout direto do contexto
    const {user} = useAuth();
  
  // Se por algum motivo o componente renderizar sem usuário, exibe um bloco vazio
    if (!user) return null;

  return (    
        <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
            {/* Mostra a primeira letra do nome do usuário dentro de um círculo azul */}
            <View style={styles.avatar}>
            <Text style={styles.avatarText}>
                {user.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
            </Text>
            </View>
            
            <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Olá,👋</Text>
            <Text style={styles.userNameText}>{user.nome}</Text>
            <Text style={styles.welcomeText}>{user.email}</Text>
            {/* Mostra a Role formatada (Ex: ALUNO, COORDENADOR) */}
            <Text style={styles.roleText}>{user.role.toLowerCase()}</Text>
            <Text style={styles.data}>{dataFormatada}</Text>
            </View>
        </View>
        </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    // backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomWidth: 1,
    // borderBottomColor: '#E2E8F0',
    // Sombra leve para destacar o cabeçalho
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F7941D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#004C94',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#ffffff',
  },
  userNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7941D',
  },
  roleText: {
    fontSize: 11,
    color: '#004C94',
    fontWeight: '600',
    textTransform: 'capitalize',
    backgroundColor: '#F7941D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  
  data: { fontSize: 13, color: '#93C5FD' },
});
