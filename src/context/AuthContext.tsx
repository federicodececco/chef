"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import axiosInstance from "@/lib/axios";
import axios from "axios";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: string;
  chef?: Chef | null;
}

interface Chef {
  id: string;
  bio?: string | null;
  bioBrief?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  phoneNumber?: string | null;
  nation?: string | null;
  slug?: string | null;
  city?: string | null;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isChef: boolean;
  chefSlug: string;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const supabase = createClient();

  const isAuthenticated = !!user;
  const isChef = !!user?.chef;
  const chefSlug = user?.chef ? `${user.chef.id}-${user.chef.slug}` : "";

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (typeof window !== "undefined") {
      if (newUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      updateUser(response.data.user);
    } catch (error) {
      console.error("Errore durante il login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      updateUser(null);
    } catch (error) {
      console.error("Errore durante il logout:", error);
      throw error;
    }
  };

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/auth/user");
      updateUser(response.data.user);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          updateUser(null);
        }
      }
      return false;
    } finally {
      setIsLoading(false);
      setHasChecked(true);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        await fetchUser();
      } else if (event === "SIGNED_OUT") {
        updateUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, fetchUser]);

  useEffect(() => {
    if (!hasChecked) {
      fetchUser();
    }
  }, [fetchUser, hasChecked]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isChef,
        chefSlug,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve essere usato all'interno di un AuthProvider");
  }
  return context;
}
