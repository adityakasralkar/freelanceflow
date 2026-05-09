import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Invoice } from '../types';

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

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const monthLabel = (date: Date) =>
  date.toLocaleString('en-US', { month: 'short' });

const daysBetween = (a: Date, b: Date) =>
  Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));

export interface MonthlyBucket {
  key: string;
  label: string;
  earned: number;
  pending: number;
  overdue: number;
}

export interface ClientIncome {
  client_id: string;
  client_name: string;
  total: number;
  percent: number;
}

export interface AgingBucket {
  label: string;
  amount: number;
  count: number;
}

export interface CashFlowSummary {
  isLoading: boolean;
  currency: string;
  hasMixedCurrencies: boolean;
  totalEarned: number;
  pending: number;
  overdue: number;
  projected: number;
  monthly: MonthlyBucket[];
  byClient: ClientIncome[];
  aging: AgingBucket[];
}

export function useCashFlow(): CashFlowSummary {
  const invoicesQ = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get<Invoice[]>('/invoices'),
  });

  const empty: CashFlowSummary = {
    isLoading: invoicesQ.isLoading,
    currency: 'INR',
    hasMixedCurrencies: false,
    totalEarned: 0,
    pending: 0,
    overdue: 0,
    projected: 0,
    monthly: [],
    byClient: [],
    aging: [],
  };

  if (!invoicesQ.data) return empty;
  const invoices = invoicesQ.data;

  const currency = pickDominantCurrency(invoices);
  const hasMixedCurrencies = new Set(invoices.map((i) => i.currency)).size > 1;

  // Top-line totals
  const totalEarned = invoices
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + num(i.total_amount), 0);
  const pending = invoices
    .filter((i) => i.status === 'sent')
    .reduce((s, i) => s + num(i.total_amount), 0);
  const overdue = invoices
    .filter((i) => i.status === 'overdue')
    .reduce((s, i) => s + num(i.total_amount), 0);

  // Projected = sent invoices due in the next 30 days
  const now = new Date();
  const thirty = new Date(now.getTime() + 30 * 86400 * 1000);
  const projected = invoices
    .filter(
      (i) =>
        i.status === 'sent' &&
        new Date(i.due_date) >= now &&
        new Date(i.due_date) <= thirty
    )
    .reduce((s, i) => s + num(i.total_amount), 0);

  // Monthly breakdown — last 6 months including current
  const monthly: MonthlyBucket[] = [];
  for (let offset = 5; offset >= 0; offset--) {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    monthly.push({
      key: monthKey(d),
      label: monthLabel(d),
      earned: 0,
      pending: 0,
      overdue: 0,
    });
  }
  const monthlyByKey = new Map(monthly.map((m) => [m.key, m]));
  for (const inv of invoices) {
    const d = new Date(inv.created_at);
    const bucket = monthlyByKey.get(monthKey(d));
    if (!bucket) continue;
    if (inv.status === 'paid') bucket.earned += num(inv.total_amount);
    else if (inv.status === 'sent') bucket.pending += num(inv.total_amount);
    else if (inv.status === 'overdue') bucket.overdue += num(inv.total_amount);
  }

  // Income by client — only paid invoices
  const clientMap = new Map<string, { name: string; total: number }>();
  for (const inv of invoices) {
    if (inv.status !== 'paid') continue;
    const existing = clientMap.get(inv.client_id) || {
      name: inv.client_name || 'Unknown',
      total: 0,
    };
    existing.total += num(inv.total_amount);
    clientMap.set(inv.client_id, existing);
  }
  const byClient: ClientIncome[] = Array.from(clientMap, ([client_id, v]) => ({
    client_id,
    client_name: v.name,
    total: v.total,
    percent: 0,
  }));
  const sumByClient = byClient.reduce((s, c) => s + c.total, 0);
  for (const c of byClient) {
    c.percent = sumByClient > 0 ? (c.total / sumByClient) * 100 : 0;
  }
  byClient.sort((a, b) => b.total - a.total);

  // Aging — pending / overdue grouped by days outstanding
  const buckets: AgingBucket[] = [
    { label: '0–15 days', amount: 0, count: 0 },
    { label: '16–30 days', amount: 0, count: 0 },
    { label: '31–60 days', amount: 0, count: 0 },
    { label: '60+ days', amount: 0, count: 0 },
  ];
  for (const inv of invoices) {
    if (inv.status !== 'sent' && inv.status !== 'overdue') continue;
    const days = daysBetween(new Date(inv.issue_date), now);
    let bucket: AgingBucket;
    if (days <= 15) bucket = buckets[0];
    else if (days <= 30) bucket = buckets[1];
    else if (days <= 60) bucket = buckets[2];
    else bucket = buckets[3];
    bucket.amount += num(inv.total_amount);
    bucket.count += 1;
  }

  return {
    isLoading: false,
    currency,
    hasMixedCurrencies,
    totalEarned,
    pending,
    overdue,
    projected,
    monthly,
    byClient,
    aging: buckets,
  };
}
