import { renderHook, act } from '@testing-library/react';

// Mock the api module to avoid import.meta.env (Vite-only) issues in Jest.
// We re-implement using actual localStorage so store tests remain meaningful.
jest.mock('../../lib/api', () => {
  const TOKEN_KEY = 'ff_token';
  return {
    setToken: jest.fn().mockImplementation((token: string) => {
      global.localStorage.setItem(TOKEN_KEY, token);
    }),
    getToken: jest.fn().mockImplementation(() => global.localStorage.getItem(TOKEN_KEY)),
    removeToken: jest.fn().mockImplementation(() => {
      global.localStorage.removeItem(TOKEN_KEY);
    }),
  };
});

import { useAuthStore } from '../../store/authStore';

// Helpers to generate real JWTs for testing
function makeJwtPayload(exp: number) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payload = btoa(JSON.stringify({ id: 'u-1', email: 'test@example.com', exp }))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${header}.${payload}.signature`;
}

const FUTURE_EXP = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
const PAST_EXP = Math.floor(Date.now() / 1000) - 3600;   // 1 hour ago

const validToken = makeJwtPayload(FUTURE_EXP);
const expiredToken = makeJwtPayload(PAST_EXP);

const mockUser = { id: 'u-1', name: 'Test User', email: 'test@example.com', role: 'freelancer' as const };

const TOKEN_KEY = 'ff_token';
const USER_KEY = 'ff_user';

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset store state
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  describe('login()', () => {
    it('sets user, token, and isAuthenticated=true', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, validToken);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(validToken);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('persists token and user to localStorage', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, validToken);
      });

      expect(localStorage.getItem(TOKEN_KEY)).toBe(validToken);
      expect(JSON.parse(localStorage.getItem(USER_KEY) || '{}')).toEqual(mockUser);
    });
  });

  describe('logout()', () => {
    it('clears user, token, and isAuthenticated', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, validToken);
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('removes token and user from localStorage', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, validToken);
        result.current.logout();
      });

      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(USER_KEY)).toBeNull();
    });
  });

  describe('initialize()', () => {
    it('restores session when token is valid and not expired', () => {
      localStorage.setItem(TOKEN_KEY, validToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.initialize();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    it('does NOT restore session when token is expired', () => {
      localStorage.setItem(TOKEN_KEY, expiredToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.initialize();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('clears localStorage when token is expired', () => {
      localStorage.setItem(TOKEN_KEY, expiredToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.initialize();
      });

      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(USER_KEY)).toBeNull();
    });

    it('does nothing when no token in localStorage', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.initialize();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('clears storage when token is malformed', () => {
      localStorage.setItem(TOKEN_KEY, 'not.a.jwt');
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.initialize();
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('setUser()', () => {
    it('updates user in store and localStorage', () => {
      const { result } = renderHook(() => useAuthStore());
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      act(() => {
        result.current.login(mockUser, validToken);
        result.current.setUser(updatedUser);
      });

      expect(result.current.user).toEqual(updatedUser);
      expect(JSON.parse(localStorage.getItem(USER_KEY) || '{}')).toEqual(updatedUser);
    });
  });
});
