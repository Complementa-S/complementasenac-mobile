import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/screens/LoginScreen';
import Dashboard from './src/screens/DashboardScreen';
import CargaComplementar from './src/screens/CargaComplementarScreen';
import Relatorio from './src/screens/RelatorioScreen';
import Perfil from './src/screens/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="CargaComplementar" component={CargaComplementar} options={{ headerShown: false }} />
        <Stack.Screen name="Relatorio" component={Relatorio} options={{ headerShown: false }} />
        <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}