import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/screens/LoginScreen';
import Dashboard from './src/screens/DashboardScreen';
import UploadScreen from './src/screens/UploadScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* initialRouteName define qual tela abre primeiro quando o app liga */}
      <Stack.Navigator initialRouteName="Login">
        
        {/* Tela de Login (escondemos o cabeçalho padrão para ficar mais bonito) */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }} 
        />
        
        {/* Tela Home */}
        <Stack.Screen 
          name="Home" 
          component={DashboardScreen} 
          options={{ headerShown: false }}
        />
        
        {/* Tela de Upload */}
        <Stack.Screen
          name="Upload"
          component={UploadScreen}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

/////// TESTE TELA DE LOGIN ///////
// export default function () {
//   return (
//     <SafeAreaView style={styles.container}>
//       {/* 2. CHAMAR A TELA COMO UM COMPONENTE: */}
//       <Login />
//     </SafeAreaView>
//   );
// }


///////  PADRÃO EXPO GO  /////////
// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Hello World!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
