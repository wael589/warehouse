import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  },

  async register(username: string, email: string, password: string, role?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      username,
      email,
      password,
      role
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ success: boolean; user: User }>('/auth/me');
    return response.data.user;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};
