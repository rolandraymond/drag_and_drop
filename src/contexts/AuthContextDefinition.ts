import { createContext } from 'react';
import type { User } from '../api/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  updateProfile: (data: { name: string; phone?: string }) => Promise<void>;
  setUser?: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);