import { useMemo, useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/shared/EmptyState';
import { useProposals } from '../../hooks/useProposals';
import { formatCurrency, formatDate, cn } from '../../utils';
import type { Proposal, ProposalStatus } from '../../types';
import ProposalDrawer from './ProposalDrawer';
import CreateProposalModal from './CreateProposalModal';

type TabKey = 'all' | ProposalStatus;
const TAB_LABELS: Record<TabKey, string> = {
  all: 'All',
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  declined: 'Declined',
};
const TAB_KEYS: TabKey[] = ['all', 'draft', 'sent', 'accepted', 'declined'];

export default function ProposalsPage() {
  const [tab, setTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: all = [], isLoading } = useProposals('all');

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = {
      all: all.length,
      draft: 0,
      sent: 0,
      accepted: 0,
      declined: 0,
    };
    for (const p of all) c[p.status]++;
    return c;
  }, [all]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all
      .filter((p) => tab === 'all' || p.status === tab)
      .filter((p) => {
        if (!q) return true;
        return (
          p.title.toLowerCase().includes(q) ||
          (p.client_name || '').toLowerCase().includes(q) ||
          (p.client_company || '').toLowerCase().includes(q)
        );
      });
  }, [all, tab, search]);

  return (
    <PageLayout
      title="Proposals"
      subtitle="Manage your proposal pipeline"
      searchPlaceholder="Search proposals…"
      searchValue={search}
      onSearchChange={setSearch}
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2.25} /> New Proposal
        </Button>
      }
    >
      {/* Live search wired up via local state — controlled input duplicates topbar */}
      <Card className="overflow-hidden p-0">
        {/* Tabs */}
        <div className="px-5">
          <div className="flex gap-0.5 border-b border-[var(--line)] -mb-px">
            {TAB_KEYS.map((key) => {
              const isActive = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    'flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[13px] transition-colors',
                    isActive
                      ? 'border-[var(--green)] font-semibold text-[var(--green-dark)]'
                      : 'border-transparent font-medium text-[var(--muted)] hover:text-[var(--text)]'
                  )}
                >
                  {TAB_LABELS[key]}
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-[11px] font-semibold',
                      isActive
                        ? 'bg-[var(--green-soft)] text-[var(--green-dark)]'
                        : 'bg-[#eef0f3] text-[var(--muted)]'
                    )}
                  >
                    {counts[key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2 border-b border-[var(--line)] px-5 py-3">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter in this list…"
              className="h-8 w-64 rounded-[7px] border border-[var(--line-strong)] bg-white px-3 text-[12px] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/15"
            />
          </div>
          <div className="ml-auto text-[12px] text-[var(--muted)]">
            Showing {filtered.length} of {all.length}
          </div>
        </div>

        {/* Table / states */}
        {isLoading ? (
          <div className="px-5 py-6 text-sm text-[var(--muted)]">Loading proposals…</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            heading={
              all.length === 0
                ? 'No proposals yet'
                : 'No proposals match this view'
            }
            subtext={
              all.length === 0
                ? 'Send your first proposal to start the pipeline.'
                : 'Try a different filter or search term.'
            }
            actionLabel={all.length === 0 ? 'Create proposal' : undefined}
            onAction={all.length === 0 ? () => setCreateOpen(true) : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[var(--panel-soft)] text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-2.5">Proposal</th>
                  <th className="px-4 py-2.5">Client</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5">Valid until</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <ProposalRow
                    key={p.id}
                    proposal={p}
                    onClick={() => setDrawerId(p.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ProposalDrawer
        proposalId={drawerId}
        onClose={() => setDrawerId(null)}
      />
      <CreateProposalModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </PageLayout>
  );
}

// ---------------------------------------------------------------------------
function ProposalRow({
  proposal,
  onClick,
}: {
  proposal: Proposal;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className="cursor-pointer border-b border-[var(--line)] transition-colors hover:bg-[#fafbfc] last:border-b-0"
    >
      <td className="px-4 py-3.5">
        <div className="font-semibold text-[var(--text)]">{proposal.title}</div>
        <div className="mono mt-0.5 text-[12px] text-[var(--muted)]">
          {proposal.id.slice(0, 8).toUpperCase()}
        </div>
      </td>
      <td className="px-4 py-3.5 text-[var(--text)]">
        {proposal.client_name || '—'}
        {proposal.client_company && (
          <div className="text-[12px] text-[var(--muted)]">
            {proposal.client_company}
          </div>
        )}
      </td>
      <td className="mono px-4 py-3.5 text-right font-semibold text-[var(--text)]">
        {formatCurrency(proposal.amount, proposal.currency)}
      </td>
      <td className="px-4 py-3.5 text-[var(--muted)]">
        {proposal.valid_until ? formatDate(proposal.valid_until) : '—'}
      </td>
      <td className="px-4 py-3.5">
        <Badge status={proposal.status} />
      </td>
    </tr>
  );
}
