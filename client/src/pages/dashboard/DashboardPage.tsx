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
    <div className="h-9 w-9 animate-pulse rounded-lg bg-[#F3F6FA]" />
    <div className="mt-3 h-3 w-24 animate-pulse rounded bg-[#F3F6FA]" />
    <div className="mt-2 h-7 w-32 animate-pulse rounded bg-[#F3F6FA]" />
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
              icon={TrendingUp}
              label="Total earned"
              value={formatCurrency(stats.totalEarned, stats.currency)}
              iconColor={{ bg: '#EAF8F2', fg: '#0F9F72' }}
            />
            <StatCard
              icon={Clock}
              label="Pending payments"
              value={formatCurrency(stats.pendingAmount, stats.currency)}
              iconColor={{ bg: '#FFF7ED', fg: '#D97706' }}
            />
            <StatCard
              icon={Folder}
              label="Active projects"
              value={String(stats.activeProjectsCount)}
              iconColor={{ bg: '#EFF6FF', fg: '#2563EB' }}
            />
            <StatCard
              icon={AlertTriangle}
              label="Overdue invoices"
              value={
                stats.overdueCount === 0
                  ? '0'
                  : `${stats.overdueCount} · ${formatCurrency(stats.overdueAmount, stats.currency)}`
              }
              iconColor={{ bg: '#FEF2F2', fg: '#DC2626' }}
            />
          </>
        )}
      </div>

      {stats.hasMixedCurrencies && (
        <p className="mt-2 text-xs text-[#98A2B3]">
          You have invoices in multiple currencies. Totals shown above use{' '}
          <span className="font-medium text-[#667085]">{stats.currency}</span> for
          display only — they're not converted across currencies.
        </p>
      )}

      {/* Row 2: Recent Activity + Pipeline Snapshot */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#111827]">Recent activity</h3>
            <Link
              to="/proposals"
              className="text-xs font-medium text-[#0F9F72] hover:text-[#087252]"
            >
              View all →
            </Link>
          </div>

          {activity.isLoading ? (
            <div className="mt-4 space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[#F3F6FA]" />
                  <div className="h-3 flex-1 animate-pulse rounded bg-[#F3F6FA]" />
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
                    <div className="truncate text-sm font-medium text-[#111827]">
                      {item.title}
                    </div>
                    <div className="truncate text-xs text-[#98A2B3]">
                      {item.subtitle}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-[#98A2B3]">
                    {relativeTime(item.timestamp)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-[#111827]">Pipeline snapshot</h3>

          {pipeline.isLoading ? (
            <div className="mt-4 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-3 animate-pulse rounded bg-[#F3F6FA]" />
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
                color="#7C3AED"
              />
              <PipelineRow
                label="Active projects"
                value={pipeline.projectsByStatus.active}
                color="#2563EB"
              />
              <PipelineRow
                label="Invoiced"
                value={
                  pipeline.invoicesByStatus.draft +
                  pipeline.invoicesByStatus.sent +
                  pipeline.invoicesByStatus.overdue
                }
                color="#D97706"
              />
              <PipelineRow
                label="Paid"
                value={pipeline.invoicesByStatus.paid}
                color="#0F9F72"
              />
            </div>
          )}
        </Card>
      </div>

      {/* Row 3: Upcoming milestones + Quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="overflow-hidden lg:col-span-5">
          <div className="flex items-center justify-between border-b border-[#E5E9F0] px-5 py-3">
            <h3 className="text-sm font-semibold text-[#111827]">Upcoming milestones</h3>
            <Link
              to="/projects"
              className="text-xs font-medium text-[#0F9F72] hover:text-[#087252]"
            >
              All projects →
            </Link>
          </div>

          {milestones.isLoading ? (
            <div className="space-y-2 px-5 py-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-[#F3F6FA]" />
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
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs font-medium text-[#667085]">
                  <tr>
                    <th className="px-5 py-2.5">Project</th>
                    <th className="px-5 py-2.5">Milestone</th>
                    <th className="px-5 py-2.5">Due</th>
                    <th className="px-5 py-2.5 text-right">Amount</th>
                    <th className="px-5 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E9F0]">
                  {milestones.items.map((m) => (
                    <tr key={m.id}>
                      <td className="px-5 py-3 text-[#111827]">
                        <Link
                          to="/projects/$projectId"
                          params={{ projectId: m.project_id }}
                          className="hover:text-[#0F9F72]"
                        >
                          {m.project_title}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-[#667085]">{m.title}</td>
                      <td className="px-5 py-3 text-[#667085]">
                        {m.due_date ? formatDate(m.due_date) : '—'}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-[#111827]">
                        {formatCurrency(m.amount, m.currency)}
                      </td>
                      <td className="px-5 py-3">
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
          <h3 className="text-sm font-semibold text-[#111827]">Quick actions</h3>
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
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[#667085]">{label}</span>
        <span className="font-semibold text-[#111827]">{value}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F3F6FA]">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${widthPct}%`, backgroundColor: color }}
        />
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
      className="flex w-full items-center justify-between rounded-lg border border-[#E5E9F0] bg-white px-3 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F8FAFC]"
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#667085]" strokeWidth={1.5} />
        {label}
      </span>
      <span className="text-[#98A2B3]">→</span>
    </Link>
  );
}
