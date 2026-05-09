import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Invoice, InvoiceStatus } from '../types';

export function useInvoices(status?: InvoiceStatus | 'all') {
  return useQuery({
    queryKey: ['invoices', status || 'all'],
    queryFn: () =>
      api.get<Invoice[]>(
        status && status !== 'all' ? `/invoices?status=${status}` : '/invoices'
      ),
  });
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: ['invoices', 'detail', id],
    queryFn: () => api.get<Invoice>(`/invoices/${id}`),
    enabled: !!id,
  });
}

export function useUpdateInvoiceStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: InvoiceStatus }) =>
      api.patch<Invoice>(`/invoices/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}
