import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function Footer() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { user, logout } = useAuth();
  if (!user) return null;

  const tabs = [
    { name: 'Dashboard',         icon: 'home-outline',       activeIcon: 'home',       label: 'Início',    onPress: () => navigation.navigate('Dashboard'),         isLogout: false },
    { name: 'CargaComplementar', icon: 'time-outline',       activeIcon: 'time',       label: 'Horas',     onPress: () => navigation.navigate('CargaComplementar'), isLogout: false },
    { name: 'Upload',            icon: 'add-circle-outline', activeIcon: 'add-circle', label: 'Enviar',    onPress: () => navigation.navigate('Upload'),            isLogout: false },
    { name: 'Relatorio',         icon: 'bar-chart-outline',  activeIcon: 'bar-chart',  label: 'Relatório', onPress: () => navigation.navigate('Relatorio'),         isLogout: false },
    { name: 'Logout',            icon: 'log-out-outline',    activeIcon: 'log-out',    label: 'Sair',      onPress: logout,                                         isLogout: true  },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.name;
        const iconColor = tab.isLogout ? '#E53E3E' : (isActive ? '#004C94' : '#9CA3AF');

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={tab.onPress}
          >
            <Ionicons
              name={(isActive ? tab.activeIcon : tab.icon) as any}
              size={24}
              color={iconColor}
            />
            <Text style={[
              styles.label,
              isActive && styles.labelActive,
              tab.isLogout && styles.logoutLabel,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontSize: 10, color: '#9CA3AF' },
  labelActive: { color: '#004C94', fontWeight: '600' },
  logoutLabel: { color: '#E53E3E', fontWeight: '600' },
});