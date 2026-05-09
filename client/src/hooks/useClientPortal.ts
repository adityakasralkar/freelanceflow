import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Invoice, Project } from '../types';

export function useClientProjects() {
  return useQuery({
    queryKey: ['client-portal', 'projects'],
    queryFn: () => api.get<Project[]>('/client-portal/my-projects'),
  });
}

export function useClientProject(id: string | undefined) {
  return useQuery({
    queryKey: ['client-portal', 'projects', 'detail', id],
    queryFn: () => api.get<Project>(`/client-portal/my-projects/${id}`),
    enabled: !!id,
  });
}

export function useClientInvoices() {
  return useQuery({
    queryKey: ['client-portal', 'invoices'],
    queryFn: () => api.get<Invoice[]>('/client-portal/my-invoices'),
  });
}

export function useClientInvoice(id: string | undefined) {
  return useQuery({
    queryKey: ['client-portal', 'invoices', 'detail', id],
    queryFn: () => api.get<Invoice>(`/client-portal/my-invoices/${id}`),
    enabled: !!id,
  });
}

export function useAcknowledgeClientInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch<Invoice>(`/client-portal/my-invoices/${id}/acknowledge`),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['client-portal', 'invoices'] });
      qc.invalidateQueries({ queryKey: ['client-portal', 'invoices', 'detail', id] });
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}
