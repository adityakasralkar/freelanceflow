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

export interface ClientInviteStatus {
  status: 'none' | 'pending' | 'accepted' | 'expired' | 'revoked';
  invitation_id?: string;
  email?: string;
  expires_at?: string;
  created_at?: string;
}

export function useClientInviteStatus(clientId: string | undefined) {
  return useQuery({
    queryKey: ['clients', 'invite', clientId],
    queryFn: () => api.get<ClientInviteStatus>(`/clients/${clientId}/invite`),
    enabled: !!clientId,
  });
}

export function useSendClientInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (clientId: string) =>
      api.post<ClientInviteStatus>(`/clients/${clientId}/invite`),
    onSuccess: (_, clientId) => {
      qc.invalidateQueries({ queryKey: ['clients', 'invite', clientId] });
    },
  });
}

export function useRevokeClientInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (clientId: string) =>
      api.delete<unknown>(`/clients/${clientId}/invite`),
    onSuccess: (_, clientId) => {
      qc.invalidateQueries({ queryKey: ['clients', 'invite', clientId] });
    },
  });
}
