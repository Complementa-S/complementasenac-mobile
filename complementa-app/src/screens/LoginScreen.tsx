import { signIn } from '../controllers/authController'; // Agora importa do Controller
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  // 1. NOVO: Estado para guardar o texto de erro do e-mail
  const [emailErro, setEmailErro] = useState<string>('');

  // 2. NOVO: A nossa Regra Regex para validar e-mails
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 3. NOVO: Função que verifica o e-mail em tempo real enquanto o usuário digita
  const handleEmailChange = (texto: string) => {
    setEmail(texto); // Atualiza o que aparece no campo

    if (texto === '') {
      setEmailErro(''); // Se estiver vazio, limpa o erro
    } else if (!regexEmail.test(texto)) {
      setEmailErro('Por favor, insira um e-mail válido.'); // Se estiver errado, avisa
    } else {
      setEmailErro(''); // Se estiver certo, tira o erro da tela
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Atenção", "Por favor, preencha e-mail e senha.");
      return;
    }
    if (!regexEmail.test(email)) {
      Alert.alert("Atenção", "O formato do e-mail está incorreto.");
      return;
    }

    try {
      setLoading(true);
      
      // 1. Passa pelo controlador, que valida e busca no Firebase + seu Backend
      const user = await signIn(email, password);
      
      // 2. Salva o usuário no estado global. 
      // Isso fará o App.tsx desmontar a tela de Login e montar o Dashboard sozinho!
      setUser(user);
      
    } catch (error: any) {
      // Captura mensagens amigáveis lançadas pelo backend ou pelo Firebase
      Alert.alert("Erro no login", error.message || "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };
  
  // const handleLogin = async (): Promise<void> => {
  // if (!email || !password) {
  //   Alert.alert("Atenção", "Por favor, preencha e-mail e senha.");
  //   return;
  // }
  // if (!regexEmail.test(email)) {
  //   Alert.alert("Atenção", "O formato do e-mail está incorreto.");
  //   return;
  // }

  // try {
  //   setLoading(true);
  //   const user = await loginWithFirebase(email, password);
  //   setUser(user);
  //   navigation.navigate('Dashboard');
  // } catch (error: any) {
  //   Alert.alert("Erro no login", "E-mail ou senha incorretos.");
  // } finally {
  //   setLoading(false);
  // }
  // };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Bem-vindo ao Complementa+</Text>
          <Text style={styles.subtitle}>Faça login na sua conta para continuar</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              // Se houver erro, a borda do input fica vermelha
              style={[styles.input, emailErro ? styles.inputErro : null]} 
              placeholder="exemplo@email.com"
              placeholderTextColor="#A0AEC0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={handleEmailChange} // Chamando a nossa nova função aqui
            />
            {/* 5. NOVO: Mostra a mensagem de erro na tela se a variável não estiver vazia */}
            {emailErro ? <Text style={styles.textoErro}>{emailErro}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#A0AEC0"
              secureTextEntry={true} 
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
              onPress={handleLogin}
                  activeOpacity={0.8}
                    disabled={loading}
                                        >
          {loading 
          ? <ActivityIndicator color="#FFFFFF" /> 
          : <Text style={styles.buttonText}>Entrar</Text>
        }
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D3748',
  },
  inputErro: {
    borderColor: '#E53E3E', 
  },
  textoErro: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  // FIM DOS NOVOS ESTILOS
  button: {
    backgroundColor: '#2B6CB0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#2B6CB0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 24,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#2B6CB0',
    fontSize: 14,
    fontWeight: '600',
  },
});