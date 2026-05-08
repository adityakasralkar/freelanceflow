import { useQuery, useQueries } from '@tanstack/react-query';
import { api } from '../lib/api';
import type {
  Invoice,
  Project,
  Proposal,
  Milestone,
  ProposalStatus,
  ProjectStatus,
  InvoiceStatus,
} from '../types';

// ---------------------------------------------------------------------------
// Base list queries — used by every dashboard slice. Cached for 1 minute.
// ---------------------------------------------------------------------------
function useInvoicesList() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get<Invoice[]>('/invoices'),
  });
}

function useProjectsList() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get<Project[]>('/projects'),
  });
}

function useProposalsList() {
  return useQuery({
    queryKey: ['proposals'],
    queryFn: () => api.get<Proposal[]>('/proposals'),
  });
}

const num = (v: string | number | null | undefined) =>
  v == null ? 0 : typeof v === 'string' ? parseFloat(v) : v;

function pickDominantCurrency(invoices: Invoice[]): string {
  if (invoices.length === 0) return 'INR';
  const counts = new Map<string, number>();
  for (const inv of invoices) {
    counts.set(inv.currency, (counts.get(inv.currency) || 0) + 1);
  }
  let best = 'INR';
  let max = 0;
  for (const [c, n] of counts) {
    if (n > max) {
      max = n;
      best = c;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Top-line stats: total earned / pending / active projects / overdue
// ---------------------------------------------------------------------------
export function useDashboardStats() {
  const invoices = useInvoicesList();
  const projects = useProjectsList();

  const isLoading = invoices.isLoading || projects.isLoading;

  if (!invoices.data || !projects.data) {
    return {
      isLoading,
      currency: 'INR',
      totalEarned: 0,
      pendingAmount: 0,
      overdueCount: 0,
      overdueAmount: 0,
      activeProjectsCount: 0,
      hasMixedCurrencies: false,
    };
  }

  const totalEarned = invoices.data
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + num(i.total_amount), 0);

  const pendingAmount = invoices.data
    .filter((i) => i.status === 'sent')
    .reduce((sum, i) => sum + num(i.total_amount), 0);

  const overdue = invoices.data.filter((i) => i.status === 'overdue');
  const overdueCount = overdue.length;
  const overdueAmount = overdue.reduce((sum, i) => sum + num(i.total_amount), 0);

  const activeProjectsCount = projects.data.filter((p) => p.status === 'active').length;

  const currencies = new Set(invoices.data.map((i) => i.currency));

  return {
    isLoading,
    currency: pickDominantCurrency(invoices.data),
    totalEarned,
    pendingAmount,
    overdueCount,
    overdueAmount,
    activeProjectsCount,
    hasMixedCurrencies: currencies.size > 1,
  };
}

// ---------------------------------------------------------------------------
// Recent activity — merge proposals/milestones/invoices, sort, take top 5
// ---------------------------------------------------------------------------
export type ActivityItem = {
  id: string;
  type: 'proposal' | 'milestone' | 'invoice';
  title: string;
  subtitle: string;
  timestamp: string;
  color: string;
};

export function useRecentActivity() {
  const proposals = useProposalsList();
  const projects = useProjectsList();
  const invoices = useInvoicesList();

  // Use existing project list to drive milestone fetching (one query per project).
  const milestoneQueries = useQueries({
    queries: (projects.data || []).map((p) => ({
      queryKey: ['milestones', p.id],
      queryFn: () => api.get<Milestone[]>(`/projects/${p.id}/milestones`),
      staleTime: 60_000,
    })),
  });

  const isLoading =
    proposals.isLoading ||
    invoices.isLoading ||
    projects.isLoading ||
    milestoneQueries.some((q) => q.isLoading);

  if (!proposals.data || !invoices.data || !projects.data) {
    return { items: [] as ActivityItem[], isLoading };
  }

  const items: ActivityItem[] = [];

  for (const p of proposals.data) {
    items.push({
      id: `proposal-${p.id}`,
      type: 'proposal',
      title: p.title,
      subtitle: `Proposal · ${p.status}`,
      timestamp: p.created_at,
      color: '#7C3AED',
    });
  }

  for (const inv of invoices.data) {
    items.push({
      id: `invoice-${inv.id}`,
      type: 'invoice',
      title: `${inv.invoice_number}${inv.project_title ? ' · ' + inv.project_title : ''}`,
      subtitle: `Invoice · ${inv.status}`,
      timestamp: inv.created_at,
      color: '#2563EB',
    });
  }

  for (const q of milestoneQueries) {
    if (!q.data) continue;
    for (const m of q.data) {
      const project = projects.data.find((p) => p.id === m.project_id);
      items.push({
        id: `milestone-${m.id}`,
        type: 'milestone',
        title: m.title,
        subtitle: `Milestone · ${project?.title || 'Project'} · ${m.status}`,
        timestamp: m.completed_at || m.created_at,
        color: '#0F9F72',
      });
    }
  }

  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return { items: items.slice(0, 5), isLoading };
}

// ---------------------------------------------------------------------------
// Pipeline snapshot — counts by status across proposals/projects/invoices
// ---------------------------------------------------------------------------
export function usePipelineSnapshot() {
  const proposals = useProposalsList();
  const projects = useProjectsList();
  const invoices = useInvoicesList();

  const isLoading = proposals.isLoading || projects.isLoading || invoices.isLoading;

  const proposalsByStatus: Record<ProposalStatus, number> = {
    draft: 0,
    sent: 0,
    accepted: 0,
    declined: 0,
  };
  for (const p of proposals.data || []) proposalsByStatus[p.status]++;

  const projectsByStatus: Record<ProjectStatus, number> = {
    active: 0,
    on_hold: 0,
    completed: 0,
    archived: 0,
  };
  for (const p of projects.data || []) projectsByStatus[p.status]++;

  const invoicesByStatus: Record<InvoiceStatus, number> = {
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
  };
  for (const i of invoices.data || []) invoicesByStatus[i.status]++;

  return { proposalsByStatus, projectsByStatus, invoicesByStatus, isLoading };
}

// ---------------------------------------------------------------------------
// Upcoming milestones — non-completed, sorted by due date
// ---------------------------------------------------------------------------
export type UpcomingMilestoneRow = {
  id: string;
  project_id: string;
  project_title: string;
  client_name?: string;
  title: string;
  due_date: string | null;
  amount: string;
  status: Milestone['status'];
  currency: string;
};

export function useUpcomingMilestones() {
  const projects = useProjectsList();

  const milestoneQueries = useQueries({
    queries: (projects.data || []).map((p) => ({
      queryKey: ['milestones', p.id],
      queryFn: () => api.get<Milestone[]>(`/projects/${p.id}/milestones`),
      staleTime: 60_000,
    })),
  });

  const isLoading =
    projects.isLoading || milestoneQueries.some((q) => q.isLoading);

  if (!projects.data) return { items: [] as UpcomingMilestoneRow[], isLoading };

  const rows: UpcomingMilestoneRow[] = [];
  milestoneQueries.forEach((q, idx) => {
    if (!q.data) return;
    const project = projects.data![idx];
    for (const m of q.data) {
      if (m.status === 'completed') continue;
      rows.push({
        id: m.id,
        project_id: project.id,
        project_title: project.title,
        client_name: project.client_name,
        title: m.title,
        due_date: m.due_date,
        amount: m.amount,
        status: m.status,
        currency: project.currency,
      });
    }
  });

  rows.sort((a, b) => {
    const av = a.due_date ? new Date(a.due_date).getTime() : Infinity;
    const bv = b.due_date ? new Date(b.due_date).getTime() : Infinity;
    return av - bv;
  });

  return { items: rows.slice(0, 6), isLoading };
}
