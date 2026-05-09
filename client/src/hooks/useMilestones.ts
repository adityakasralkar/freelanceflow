import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Milestone, Invoice } from '../types';

export function useMilestones(projectId: string | undefined) {
  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: () => api.get<Milestone[]>(`/projects/${projectId}/milestones`),
    enabled: !!projectId,
  });
}

export interface CreateMilestoneInput {
  title: string;
  description?: string;
  due_date: string;
  amount: number;
}

export function useCreateMilestone(projectId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMilestoneInput) =>
      api.post<Milestone>(`/projects/${projectId}/milestones`, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['milestones', projectId] });
    },
  });
}

export function useUpdateMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: { id: string } & Partial<CreateMilestoneInput>) =>
      api.patch<Milestone>(`/milestones/${id}`, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
}

export interface CompleteMilestoneResponse {
  milestone: Milestone;
  canGenerateInvoice: boolean;
}

export function useCompleteMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch<CompleteMilestoneResponse>(`/milestones/${id}/complete`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
}

export interface GenerateInvoiceInput {
  milestoneId: string;
  tax_rate?: number;
  tax_label?: string;
  notes?: string;
  issue_date?: string;
  due_date?: string;
}

export function useGenerateInvoiceFromMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ milestoneId, ...rest }: GenerateInvoiceInput) =>
      api.post<Invoice>(`/invoices/generate/${milestoneId}`, rest),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['milestones'] });
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}
