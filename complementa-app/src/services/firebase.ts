import { initializeApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const env = (key: string, fallback: string) => {
  const value = (globalThis as any)?.process?.env?.[key];
  return value || fallback;
};

const firebaseConfig = {
  apiKey: env('EXPO_PUBLIC_FIREBASE_APIKEY', 'AIzaSyB4oWuOGDjJmsBXdy9WGWEB_Q_vapH0h4I'),
  authDomain: env('EXPO_PUBLIC_FIREBASE_AUTHDOMAIN', 'pi-3-286ed.firebaseapp.com'),
  projectId: env('EXPO_PUBLIC_FIREBASE_PROJECTID', 'pi-3-286ed'),
  storageBucket: env('EXPO_PUBLIC_FIREBASE_STORAGEBUCKET', 'pi-3-286ed.firebasestorage.app'),
  messagingSenderId: env('EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID', '808575862472'),
  appId: env('EXPO_PUBLIC_FIREBASE_APPID', '1:808575862472:web:0159933b1aaad7069e07fd'),
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);

// Função para logar com e-mail e senha já existentes
export const loginComEmail = async (email: string, senha: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, senha);
  return userCredential.user;
};

// Função para fazer logout completo
export const deslogarUsuario = async () => {
  await signOut(auth);
};

export default app;