import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUser } from '../models/User';

type AuthContextValue = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  loading: boolean;
};

const STORAGE_KEY = '@complementa_user';

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => undefined,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setUserState(JSON.parse(raw));
      })
      .finally(() => setLoading(false));
  }, []);

  const setUser = (next: AppUser | null) => {
    setUserState(next);
    if (next) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo(() => ({ user, setUser, loading }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

