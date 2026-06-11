import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { AppUser } from '../models/User';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { logoutFirebase } from '../services/firebaseRepository';

type AuthContextValue = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  loading: boolean; // Adicionado para evitar que a tela pisque ao abrir o app
  logout: () => Promise<void>; // Adicionado para gerenciar o logout centralizado
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => undefined,
  loading: true,
  logout: async () => undefined,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Esse bloco monitora o estado real do Firebase (útil se o token expirar ou deslogar de fora)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null); // Se o Firebase diz que não tem usuário, limpa o estado
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Função centralizada para fazer logout do Firebase e limpar o estado
  const logout = async () => {
    try {
      await logoutFirebase();
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Atualizado para incluir o loading e o logout no cache do useMemo
  const value = useMemo(() => ({ user, setUser, loading, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}





// import React, { createContext, useContext, useMemo, useState } from 'react';
// import { AppUser } from '../models/User';

// type AuthContextValue = {
//   user: AppUser | null;
//   setUser: (user: AppUser | null) => void;
// };

// const AuthContext = createContext<AuthContextValue>({ user: null, setUser: () => undefined });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<AppUser | null>(null);
//   const value = useMemo(() => ({ user, setUser }), [user]);
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }