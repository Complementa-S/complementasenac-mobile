import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'Dashboard',         icon: 'home-outline',      activeIcon: 'home',      label: 'Início'    },
    { name: 'CargaComplementar', icon: 'time-outline',      activeIcon: 'time',      label: 'Horas'     },
    { name: 'Relatorio',         icon: 'bar-chart-outline', activeIcon: 'bar-chart', label: 'Relatório' },
    { name: 'Perfil',            icon: 'person-outline',    activeIcon: 'person',    label: 'Perfil'    },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Ionicons
              name={(isActive ? tab.activeIcon : tab.icon) as any}
              size={24}
              color={isActive ? '#1E3A8A' : '#9CA3AF'}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
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
  labelActive: { color: '#1E3A8A', fontWeight: '600' },
});