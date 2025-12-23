import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import AuthService, { type User } from '../api/auth';
import { AuthContext, type AuthContextType } from './AuthContextDefinition';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => !!localStorage.getItem('access_token'));

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const fetchedUser = await AuthService.getUser();
          console.log('Fetched user on reload:', fetchedUser);
          setUser(fetchedUser);
        } catch (error) {
          console.error('Failed to fetch user on reload:', error);
          localStorage.removeItem('access_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await AuthService.login({ email, password });
    localStorage.setItem('access_token', response.access_token);
    setUser(response.user);
  };

  const logout = async () => {
  await AuthService.logout();
  localStorage.removeItem('access_token');
  setUser(null);
};

const logoutAll = async () => {
  await AuthService.logoutAll();
  localStorage.removeItem('access_token');
  setUser(null);
};

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    await AuthService.register({ name, email, password, password_confirmation: passwordConfirmation, });
  };

  const updateProfile = async (data: { name: string; phone?: string }) => {
    const updatedUser = await AuthService.updateProfile(data);
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    logoutAll,
    register,
    updateProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};