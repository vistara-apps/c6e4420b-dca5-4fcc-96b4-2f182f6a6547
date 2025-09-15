'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, User } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (farcasterId: string) => Promise<void>;
  signup: (data: { username: string; farcasterId: string; profilePicUrl?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('kickback-token');
    if (storedToken) {
      setToken(storedToken);
      apiClient.setToken(storedToken);
      // In a real app, you'd validate the token here
    }
    setIsLoading(false);
  }, []);

  const login = async (farcasterId: string) => {
    try {
      const response = await apiClient.login(farcasterId);
      setToken(response.token);
      setUser(response.user);
      apiClient.setToken(response.token);
      localStorage.setItem('kickback-token', response.token);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data: { username: string; farcasterId: string; profilePicUrl?: string }) => {
    try {
      const response = await apiClient.signup(data);
      setToken(response.token);
      setUser(response.user);
      apiClient.setToken(response.token);
      localStorage.setItem('kickback-token', response.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    apiClient.setToken('');
    localStorage.removeItem('kickback-token');
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const updatedUser = await apiClient.updateUser(user.userId, data);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

