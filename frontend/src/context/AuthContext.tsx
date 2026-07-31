import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import api, { clearStoredAuth, persistAuth, readStoredAuth } from "../lib/api";
import type { AuthUser } from "../lib/api";

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isReady: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedAuth = readStoredAuth();
  const [token, setToken] = useState<string | null>(storedAuth?.token ?? null);
  const [user, setUser] = useState<AuthUser | null>(storedAuth?.user ?? null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  async function login(username: string, password: string) {
    try {
      const response = await api.post("/auth/login", { username, password });
      const nextToken = response.data.token as string;
      const nextUser = response.data.user as AuthUser;

      persistAuth(nextToken, nextUser);
      setToken(nextToken);
      setUser(nextUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in right now.";
      console.error("Login request failed:", error);
      throw new Error(message);
    }
  }

  function logout() {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ token, user, isReady, login, logout }),
    [token, user, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}