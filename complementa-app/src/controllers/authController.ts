import { loginWithFirebase, logoutFirebase } from '../services/firebaseRepository';

export async function signIn(email: string, password: string) {
  if (!email.trim() || !password) throw new Error('Preencha e-mail e senha.');
  return loginWithFirebase(email, password);
}

export async function signOut() {
  return logoutFirebase();
}

