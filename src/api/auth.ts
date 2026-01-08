import apiClient from './client';
import axios from 'axios';

const authClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

class AuthService {
  async register(data: { name: string; email: string; password: string; password_confirmation: string; }): Promise<void> {
    await authClient.post('/register', data);
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await authClient.post<AuthResponse>('/login', data);
    return response.data;
  }

  async forgotPassword(data: { email: string }): Promise<void> {
    await authClient.post('/forgot-password', data);
  }

  async resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }): Promise<void> {
    await authClient.post('/reset-password', data);
  }

  async logout(): Promise<void> {
    await apiClient.post('/logout');
    localStorage.removeItem('access_token');
  }

  async logoutAll(): Promise<void> {
    await apiClient.post('/logout-all');
    localStorage.removeItem('access_token');
  }

  async getUser(): Promise<User> {
    const response = await apiClient.get('/user');
    return response.data.user || response.data;
  }

  async updateProfile(data: { name: string; phone?: string }): Promise<User> {
    const response = await apiClient.put('/profile', data);
    return response.data.user;
  }

  async resendEmailVerification(): Promise<void> {
    await authClient.post('/email/resend');
  }

  async verifyEmail(token: string): Promise<void> {
    const encoded = encodeURIComponent(token);
    await authClient.get(`/email/verify/${encoded}`);
  }
}

export default new AuthService();