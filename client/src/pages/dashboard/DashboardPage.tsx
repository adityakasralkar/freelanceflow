import { Link } from '@tanstack/react-router';
import {
  TrendingUp,
  Clock,
  Folder,
  AlertTriangle,
  Plus,
  UserPlus,
  Receipt,
  LineChart,
  Inbox,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatCard from '../../components/shared/StatCard';
import EmptyState from '../../components/shared/EmptyState';
import Badge from '../../components/ui/Badge';
import {
  useDashboardStats,
  useRecentActivity,
  usePipelineSnapshot,
  useUpcomingMilestones,
} from '../../hooks/useDashboard';
import { formatCurrency, formatDate } from '../../utils';

const StatSkeleton = () => (
  <Card className="p-5">
    <div className="h-9 w-9 animate-pulse rounded-lg bg-[var(--surface2)]" />
    <div className="mt-3 h-3 w-24 animate-pulse rounded bg-[var(--surface2)]" />
    <div className="mt-2 h-7 w-32 animate-pulse rounded bg-[var(--surface2)]" />
  </Card>
);

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export default function DashboardPage() {
  const stats = useDashboardStats();
  const activity = useRecentActivity();
  const pipeline = usePipelineSnapshot();
  const milestones = useUpcomingMilestones();

  return (
    <PageLayout
      title="Dashboard"
      subtitle="Overview of your business this period."
      actions={
        <Link to="/proposals">
          <Button>
            <Plus className="h-4 w-4" strokeWidth={2} /> New Proposal
          </Button>
        </Link>
      }
    >
      {/* Row 1: Top-line stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.isLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              hero
              icon={TrendingUp}
              label="Total earned"
              value={formatCurrency(stats.totalEarned, stats.currency)}
            />
            <StatCard
              icon={Clock}
              label="Pending payments"
              value={formatCurrency(stats.pendingAmount, stats.currency)}
              tone="amber"
            />
            <StatCard
              icon={Folder}
              label="Active projects"
              value={String(stats.activeProjectsCount)}
              tone="blue"
            />
            <StatCard
              icon={AlertTriangle}
              label="Overdue invoices"
              value={
                stats.overdueCount === 0
                  ? '0'
                  : `${stats.overdueCount} · ${formatCurrency(stats.overdueAmount, stats.currency)}`
              }
              tone="red"
            />
          </>
        )}
      </div>

      {stats.hasMixedCurrencies && (
        <p className="mt-2 text-xs text-[var(--faint)]">
          You have invoices in multiple currencies. Totals shown above use{' '}
          <span className="font-medium text-[var(--muted)]">{stats.currency}</span> for
          display only — they're not converted across currencies.
        </p>
      )}

      {/* Row 2: Recent Activity + Pipeline Snapshot */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text)]">Recent activity</h3>
            <Link
              to="/proposals"
              className="text-xs font-medium text-[var(--green)] hover:text-[var(--green-dark)]"
            >
              View all →
            </Link>
          </div>

          {activity.isLoading ? (
            <div className="mt-4 space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--surface2)]" />
                  <div className="h-3 flex-1 animate-pulse rounded bg-[var(--surface2)]" />
                </div>
              ))}
            </div>
          ) : activity.items.length === 0 ? (
            <div className="py-6">
              <EmptyState
                icon={Inbox}
                heading="No activity yet"
                subtext="Send your first proposal to get started."
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {activity.items.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[var(--text)]">
                      {item.title}
                    </div>
                    <div className="truncate text-xs text-[var(--faint)]">
                      {item.subtitle}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-[var(--faint)]">
                    {relativeTime(item.timestamp)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-[var(--text)]">Pipeline snapshot</h3>

          {pipeline.isLoading ? (
            <div className="mt-4 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-3 animate-pulse rounded bg-[var(--surface2)]" />
              ))}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <PipelineRow
                label="Proposals"
                value={
                  pipeline.proposalsByStatus.draft +
                  pipeline.proposalsByStatus.sent +
                  pipeline.proposalsByStatus.accepted
                }
                color="var(--purple)"
              />
              <PipelineRow
                label="Active projects"
                value={pipeline.projectsByStatus.active}
                color="var(--blue)"
              />
              <PipelineRow
                label="Invoiced"
                value={
                  pipeline.invoicesByStatus.draft +
                  pipeline.invoicesByStatus.sent +
                  pipeline.invoicesByStatus.overdue
                }
                color="var(--amber)"
              />
              <PipelineRow
                label="Paid"
                value={pipeline.invoicesByStatus.paid}
                color="var(--green)"
              />
            </div>
          )}
        </Card>
      </div>

      {/* Row 3: Upcoming milestones + Quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="overflow-hidden lg:col-span-5">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
            <h3 className="text-sm font-semibold text-[var(--text)]">Upcoming milestones</h3>
            <Link
              to="/projects"
              className="text-xs font-medium text-[var(--green)] hover:text-[var(--green-dark)]"
            >
              All projects →
            </Link>
          </div>

          {milestones.isLoading ? (
            <div className="space-y-2 px-5 py-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-[var(--surface2)]" />
              ))}
            </div>
          ) : milestones.items.length === 0 ? (
            <div className="py-6">
              <EmptyState
                icon={Folder}
                heading="No upcoming milestones"
                subtext="Add milestones to your projects to track progress."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="pl-table">
                <thead>
                  <tr>
                    <th>Milestone</th>
                    <th>Due</th>
                    <th className="!text-right">Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.items.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <Link
                          to="/projects/$projectId"
                          params={{ projectId: m.project_id }}
                          className="hover:text-[var(--green)]"
                        >
                          <div className="pl-cell-1">{m.title}</div>
                          <div className="pl-cell-2">{m.project_title}</div>
                        </Link>
                      </td>
                      <td className="text-[var(--muted)]">
                        {m.due_date ? formatDate(m.due_date) : '—'}
                      </td>
                      <td className="pl-mono pl-cell-1 !text-right">
                        {formatCurrency(m.amount, m.currency)}
                      </td>
                      <td>
                        <Badge status={m.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-[var(--text)]">Quick actions</h3>
          <div className="mt-4 space-y-2">
            <QuickAction icon={Plus} label="New proposal" to="/proposals" />
            <QuickAction icon={UserPlus} label="Add client" to="/clients" />
            <QuickAction icon={Receipt} label="View invoices" to="/invoices" />
            <QuickAction icon={LineChart} label="Cash flow" to="/dashboard/cashflow" />
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PipelineRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  // Bar fills proportionally up to 10 items as a visual hint.
  const widthPct = Math.min(100, (value / 10) * 100);
  const toneClass =
    color === 'var(--amber)' ? 'a' : color === 'var(--blue)' || color === 'var(--purple)' ? 'b' : '';
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-[var(--text)]">{label}</span>
        <span className="pl-num text-[13px] font-bold text-[var(--text)]">{value}</span>
      </div>
      <div className={`pl-bar mt-1.5 ${toneClass}`}>
        <span style={{ width: `${widthPct}%` }} />
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  to,
}: {
  icon: typeof Plus;
  label: string;
  to: '/proposals' | '/clients' | '/invoices' | '/dashboard/cashflow';
}) {
  return (
    <Link
      to={to}
      className="flex w-full items-center justify-between rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--panel-soft)]"
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--muted)]" strokeWidth={1.5} />
        {label}
      </span>
      <span className="text-[var(--faint)]">→</span>
    </Link>
  );
}
