import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Proposal, ProposalStatus, Project } from '../types';

const proposalsKey = (status?: ProposalStatus | 'all') =>
  ['proposals', status || 'all'] as const;

export function useProposals(status?: ProposalStatus | 'all') {
  return useQuery({
    queryKey: proposalsKey(status),
    queryFn: () =>
      api.get<Proposal[]>(
        status && status !== 'all' ? `/proposals?status=${status}` : '/proposals'
      ),
  });
}

export function useProposal(id: string | undefined) {
  return useQuery({
    queryKey: ['proposals', 'detail', id],
    queryFn: () => api.get<Proposal>(`/proposals/${id}`),
    enabled: !!id,
  });
}

export interface CreateProposalInput {
  client_id: string;
  title: string;
  description?: string;
  amount: number;
  valid_until?: string;
  payment_terms?: string;
  deliverables?: string[];
  currency?: string;
}

export function useCreateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProposalInput) =>
      api.post<Proposal>('/proposals', input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

export function useUpdateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<CreateProposalInput>) =>
      api.patch<Proposal>(`/proposals/${id}`, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

export function useUpdateProposalStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProposalStatus }) =>
      api.patch<Proposal>(`/proposals/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

export function useDeleteProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<unknown>(`/proposals/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

export interface ConvertProposalInput {
  id: string;
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

export function useConvertProposalToProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...rest }: ConvertProposalInput) =>
      api.post<Project>(`/proposals/${id}/convert`, rest),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proposals'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
