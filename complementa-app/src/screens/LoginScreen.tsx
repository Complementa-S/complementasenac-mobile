import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { signIn } from '../controllers/authController';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../constants/theme';

export default function LoginScreen() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErro, setEmailErro] = useState('');
  const [loading, setLoading] = useState(false);

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (texto: string) => {
    setEmail(texto);
    if (!texto) setEmailErro('');
    else if (!regexEmail.test(texto)) setEmailErro('Por favor, insira um e-mail valido.');
    else setEmailErro('');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atencao', 'Preencha e-mail e senha.');
      return;
    }
    if (!regexEmail.test(email)) {
      Alert.alert('Atencao', 'O formato do e-mail esta incorreto.');
      return;
    }

    setLoading(true);
    try {
      const user = await signIn(email, password);
      if (user.role !== 'ALUNO') {
        Alert.alert('Acesso restrito', 'O aplicativo mobile e exclusivo para alunos.');
        return;
      }
      setUser(user);
    } catch (error: any) {
      Alert.alert('Erro no login', error?.message || 'Nao foi possivel autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.hero}>
        <View style={styles.brandMark}>
          <Text style={styles.brandText}>Complementa+</Text>
        </View>
        <Text style={styles.heroTitle}>Gestao de horas complementares</Text>
        <Text style={styles.heroSubtitle}>
          Envie atividades pelo celular e acompanhe seu progresso em tempo real.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Use sua conta de aluno cadastrada no sistema</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, emailErro ? styles.inputErro : null]}
            placeholder="exemplo@email.com"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleEmailChange}
          />
          {emailErro ? <Text style={styles.textoErro}>{emailErro}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <Text style={styles.apiHint}>API: complementasenac.onrender.com</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  hero: {
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 28,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  brandMark: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  brandText: { color: theme.colors.primary, fontWeight: '700', fontSize: 15 },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
  heroSubtitle: { fontSize: 15, color: theme.colors.textMuted, lineHeight: 22 },
  formContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: theme.colors.textMuted, marginBottom: 28 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.button,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    color: theme.colors.text,
  },
  inputErro: { borderColor: theme.colors.danger },
  textoErro: { color: theme.colors.danger, fontSize: 12, marginTop: 4 },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.radius.button,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  apiHint: { marginTop: 20, textAlign: 'center', fontSize: 11, color: theme.colors.textMuted },
});
