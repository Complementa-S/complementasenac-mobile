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

  // Definição das abas com uma propriedade de ação personalizada
  const tabs = [
    { name: 'Dashboard',         icon: 'home-outline',      activeIcon: 'home',      label: 'Início',    onPress: () => navigation.navigate('Dashboard') },
    { name: 'CargaComplementar', icon: 'time-outline',      activeIcon: 'time',      label: 'Horas',     onPress: () => navigation.navigate('CargaComplementar') },
    { name: 'Relatorio',         icon: 'bar-chart-outline', activeIcon: 'bar-chart', label: 'Relatório', onPress: () => navigation.navigate('Relatorio') },
    { name: 'Logout',            icon: 'log-out-outline',   activeIcon: 'log-out',   label: 'Sair',      onPress: logout, isLogout: true },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.name;
        
        // Define a cor com base no estado ativo ou se é o botão de logout
        const iconColor = tab.isLogout ? '#E53E3E' : (isActive ? '#1E3A8A' : '#9CA3AF');

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
              tab.isLogout && styles.logoutLabel
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
  labelActive: { color: '#1E3A8A', fontWeight: '600' },
  logoutLabel: { color: '#E53E3E', fontWeight: '600' },
});





























// import React from 'react';
// import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuth } from '../contexts/AuthContext'; // Importa o nosso contexto global

// export default function Footer() {
//   const navigation = useNavigation<any>();
//   const route = useRoute();
//   const insets = useSafeAreaInsets();

//   const { user, logout } = useAuth();
//   if (!user) return null;

//   const tabs = [
//     { name: 'Dashboard',         icon: 'home-outline',      activeIcon: 'home',      label: 'Início'    },
//     { name: 'CargaComplementar', icon: 'time-outline',      activeIcon: 'time',      label: 'Horas'     },
//     { name: 'Relatorio',         icon: 'bar-chart-outline', activeIcon: 'bar-chart', label: 'Relatório' },
//     { name:  logout,             icon: 'log-out-outline',   activeIcon: 'log-out',   label: 'Sair'      },
//   ];

//   return (
//       <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
//         {tabs.map((tab) => {
//           const isActive = route.name === tab.name;
//           return (
//             <TouchableOpacity
//               key={tab.name}
//               style={styles.tab}
//               onPress={() => navigation.navigate(tab.name)}
//             >
//               <Ionicons
//                 name={(isActive ? tab.activeIcon : tab.icon) as any}
//                 size={24}
//                 color={isActive ? '#1E3A8A' : '#9CA3AF'}
//               />
//               <Text style={[styles.label, isActive && styles.labelActive]}>
//                 {tab.label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//         {/* Botão de Sair integrado com o Firebase */}
//         <TouchableOpacity onPress={logout}>
//           <Ionicons name="log-out-outline" size={26} color="#E53E3E" />
//           <Text style={styles.logoutButtonText}>Sair</Text>
//         </TouchableOpacity>
//       </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     paddingTop: 10,
//   },
//   tab: { flex: 1, alignItems: 'center', gap: 4 },
//   label: { fontSize: 10, color: '#9CA3AF' },
//   labelActive: { color: '#1E3A8A', fontWeight: '600' },

//   logoutButton: {
//     backgroundColor: '#FFF5F5',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#FED7D7',
//   },
//   logoutButtonText: {
//     color: '#E53E3E',
//     fontSize: 10,
//     fontWeight: '600',
//   },
// });