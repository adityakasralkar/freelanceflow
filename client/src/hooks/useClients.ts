import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Client } from '../types';

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get<Client[]>('/clients'),
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ['clients', 'detail', id],
    queryFn: () => api.get<Client>(`/clients/${id}`),
    enabled: !!id,
  });
}

export interface ClientInput {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  location?: string;
  currency?: string;
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ClientInput) => api.post<Client>('/clients', input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<ClientInput>) =>
      api.patch<Client>(`/clients/${id}`, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<unknown>(`/clients/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}
