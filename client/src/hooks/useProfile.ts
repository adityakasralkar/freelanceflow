import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { User } from '../types';

export function useMyProfile() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get<User>('/auth/me'),
  });
}

export function useUpdateMyProfile() {
  const qc = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (input: Partial<User>) => api.patch<User>('/auth/me', input),
    onSuccess: (user) => {
      setUser(user);
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}
