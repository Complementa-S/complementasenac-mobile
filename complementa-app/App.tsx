import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Login from './src/screens/LoginScreen';
import Dashboard from './src/screens/DashboardScreen';
import CargaComplementar from './src/screens/CargaComplementarScreen';
import Relatorio from './src/screens/RelatorioScreen';
import Upload from './src/screens/UploadScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login"             component={Login}          options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard"         component={Dashboard}      options={{ headerShown: false }} />
          <Stack.Screen name="CargaComplementar" component={CargaComplementar} options={{ headerShown: false }} />
          <Stack.Screen name="Upload"            component={Upload}         options={{ headerShown: false }} />
          <Stack.Screen name="Relatorio"         component={Relatorio}      options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}