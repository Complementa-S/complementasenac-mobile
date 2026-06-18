import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

import Login from './src/screens/LoginScreen';
import Dashboard from './src/screens/DashboardScreen';
import CargaComplementar from './src/screens/CargaComplementarScreen';
import Relatorio from './src/screens/RelatorioScreen';
import Upload from './src/screens/UploadScreen';

const Stack = createNativeStackNavigator();

// Criamos um componente interno para conseguir usar o hook `useAuth`
function NavigationRouter() {
  const { user, loading } = useAuth();

  // Enquanto o Firebase está checando se o usuário já estava logado no celular, mostra um carregando
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F9FC' }}>
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user == null ? (
          // 🔓 Rota pública: Se NÃO tem usuário logado, ele SÓ consegue ver a tela de Login
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        ) : (
          // 🔒 Rotas protegidas: Se o usuário ESTÁ logado, essas telas ficam ativas
          <>
            <Stack.Screen name="Dashboard"         component={Dashboard}         options={{ headerShown: false }} />
            <Stack.Screen name="CargaComplementar" component={CargaComplementar} options={{ headerShown: false }} />
            <Stack.Screen name="Upload"            component={Upload}            options={{ headerShown: false }} />
            <Stack.Screen name="Relatorio" component={Relatorio}         options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationRouter />
      </AuthProvider>
    </SafeAreaProvider>
  );
}





// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { AuthProvider } from './src/contexts/AuthContext'; // 👈 FALTAVA ISSO

// import Login from './src/screens/LoginScreen';
// import Dashboard from './src/screens/DashboardScreen';
// import CargaComplementar from './src/screens/CargaComplementarScreen';
// import Relatorio from './src/screens/RelatorioScreen';
// import Upload from './src/screens/UploadScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <AuthProvider>
//         <NavigationContainer>
//           <Stack.Navigator initialRouteName="Login">
//             <Stack.Screen name="Login"             component={Login}             options={{ headerShown: false }} />
//             <Stack.Screen name="Dashboard"         component={Dashboard}         options={{ headerShown: false }} />
//             <Stack.Screen name="CargaComplementar" component={CargaComplementar} options={{ headerShown: false }} />
//             <Stack.Screen name="Upload"            component={Upload}            options={{ headerShown: false }} />
//             <Stack.Screen name="Relatorio"         component={Relatorio}         options={{ headerShown: false }} />
//           </Stack.Navigator>
//         </NavigationContainer>
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// }