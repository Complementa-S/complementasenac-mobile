import React, { createContext, useContext, useMemo, useState } from 'react';
import { AppUser } from '../models/User';

type AuthContextValue = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
};

const AuthContext = createContext<AuthContextValue>({ user: null, setUser: () => undefined });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

