import { create } from 'zustand';
import type { User } from '../types';
import { setToken, getToken, removeToken } from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
  setUser: (user: User) => void;
}

const USER_KEY = 'ff_user';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user, token) => {
    setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    removeToken();
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = getToken();
    const userRaw = localStorage.getItem(USER_KEY);
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        removeToken();
        localStorage.removeItem(USER_KEY);
      }
    }
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },
}));
