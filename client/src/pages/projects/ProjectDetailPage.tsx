import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { CheckCircle2, CreditCard, Plus } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/shared/Avatar';
import { useProject } from '../../hooks/useProjects';
import { useMilestones } from '../../hooks/useMilestones';
import { useInvoices } from '../../hooks/useInvoices';
import { formatCurrency, formatDate, cn } from '../../utils';
import MilestonesTab from './MilestonesTab';
import AddMilestoneModal from './AddMilestoneModal';

type TabKey = 'overview' | 'milestones' | 'invoices';

export default function ProjectDetailPage() {
  const { projectId } = useParams({ strict: false }) as { projectId: string };
  const [tab, setTab] = useState<TabKey>('overview');
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);

  const { data: project, isLoading } = useProject(projectId);
  const { data: milestones = [] } = useMilestones(projectId);
  const { data: allInvoices = [] } = useInvoices();

  const projectInvoices = allInvoices.filter((i) => i.project_id === projectId);

  if (isLoading) {
    return (
      <PageLayout title="Loading…">
        <div className="text-sm text-[var(--muted)]">Loading project…</div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout
        title="Project not found"
        breadcrumb={[{ label: 'Projects' }, { label: 'Not found' }]}
      >
        <Link
          to="/projects"
          className="text-[13px] font-semibold text-[var(--green-dark)] hover:underline"
        >
          ← Back to Projects
        </Link>
      </PageLayout>
    );
  }

  const total = milestones.length;
  const done = milestones.filter((m) => m.status === 'completed').length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const deliverables = normalizeDeliverables(project.proposal_deliverables);
  const checklistItems =
    deliverables.length > 0
      ? deliverables
      : milestones.map((m) => m.title).filter(Boolean);
  const nextMilestone = milestones.find((m) => m.status !== 'completed');

  const totalValue = parseFloat(project.total_amount || '0');
  const earned = projectInvoices
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + parseFloat(i.total_amount), 0);
  const inProgress = projectInvoices
    .filter((i) => i.status === 'sent' || i.status === 'draft')
    .reduce((s, i) => s + parseFloat(i.total_amount), 0);
  const remaining = Math.max(0, totalValue - earned - inProgress);

  return (
    <>
      <PageLayout
        title={project.title}
        subtitle={`${project.client_name || '—'}${
          project.start_date ? ` · Started ${formatDate(project.start_date)}` : ''
        }`}
        breadcrumb={[
          { label: 'Projects' },
          { label: project.title },
        ]}
        actions={
          <>
            <Badge status={project.status} />
            <Button onClick={() => setAddMilestoneOpen(true)}>
              <Plus className="h-3.5 w-3.5" strokeWidth={2.25} /> Add milestone
            </Button>
          </>
        }
      >
        {/* Tabs */}
        <div className="-mt-2 mb-5 border-b border-[var(--line)]">
          <div className="flex gap-0.5 -mb-px">
            <TabBtn active={tab === 'overview'} onClick={() => setTab('overview')}>
              Overview
            </TabBtn>
            <TabBtn active={tab === 'milestones'} onClick={() => setTab('milestones')}>
              Milestones
              <span className={countCls(tab === 'milestones')}>{milestones.length}</span>
            </TabBtn>
            <TabBtn active={tab === 'invoices'} onClick={() => setTab('invoices')}>
              Invoices
              <span className={countCls(tab === 'invoices')}>{projectInvoices.length}</span>
            </TabBtn>
          </div>
        </div>

        {/* Body */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Card className="p-5">
                <h3 className="text-[14px] font-bold text-[var(--text)]">About</h3>
                <p className="mt-2 text-[13px] leading-[1.65] text-[#374151]">
                  {project.description || 'No description provided.'}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-4">
                  <Field label="Status">
                    <Badge status={project.status} />
                  </Field>
                  <Field label="Currency">
                    <div className="text-[13px] font-semibold">{project.currency}</div>
                  </Field>
                  <Field label="Start date">
                    <div className="text-[13px]">
                      {project.start_date ? formatDate(project.start_date) : '—'}
                    </div>
                  </Field>
                  <Field label="End date">
                    <div className="text-[13px]">
                      {project.end_date ? formatDate(project.end_date) : '—'}
                    </div>
                  </Field>
                  {project.payment_terms && (
                    <Field label="Payment terms">
                      <div className="text-[13px]">{project.payment_terms}</div>
                    </Field>
                  )}
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[14px] font-bold text-[var(--text)]">
                    Deliverables checklist
                  </h3>
                  <span className="text-[12px] text-[var(--muted)]">
                    {done} / {total || checklistItems.length} complete
                  </span>
                </div>
                {checklistItems.length === 0 ? (
                  <p className="mt-3 text-[13px] text-[var(--muted)]">
                    No deliverables have been added yet. Add milestones to turn
                    the project into billable work.
                  </p>
                ) : (
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {checklistItems.map((item, index) => {
                      const milestone = milestones[index];
                      const isComplete =
                        milestone?.status === 'completed' ||
                        (deliverables.length > 0 && index < done);
                      return (
                        <div
                          key={`${item}-${index}`}
                          className="flex min-w-0 items-center gap-2 rounded-[7px] border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-2"
                        >
                          <CheckCircle2
                            className={
                              isComplete
                                ? 'h-4 w-4 shrink-0 text-[var(--green)]'
                                : 'h-4 w-4 shrink-0 text-[var(--faint)]'
                            }
                            strokeWidth={1.8}
                          />
                          <span className="truncate text-[12.5px] font-medium text-[var(--text)]">
                            {item}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-[7px] bg-[var(--green-soft)] text-[var(--green-dark)]">
                    <CreditCard className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-[14px] font-bold text-[var(--text)]">
                    Payment structure
                  </h3>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Metric label="Terms">
                    {project.payment_terms || 'Milestone based'}
                  </Metric>
                  <Metric label="Milestones">
                    {total === 0 ? 'Not planned' : `${total} scheduled`}
                  </Metric>
                  <Metric label="Next billing">
                    {nextMilestone
                      ? `${nextMilestone.title} · ${formatCurrency(
                          nextMilestone.amount,
                          project.currency
                        )}`
                      : 'All complete'}
                  </Metric>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="text-[14px] font-bold text-[var(--text)]">
                  Project summary
                </h3>
                <div className="mt-3 flex flex-col gap-2">
                  <Row label="Total value">
                    <span className="mono">
                      {formatCurrency(totalValue, project.currency)}
                    </span>
                  </Row>
                  <Row label="Earned">
                    <span className="mono text-[var(--green-dark)]">
                      {formatCurrency(earned, project.currency)}
                    </span>
                  </Row>
                  <Row label="In progress">
                    <span className="mono text-[var(--amber)]">
                      {formatCurrency(inProgress, project.currency)}
                    </span>
                  </Row>
                  <Row label="Remaining">
                    <span className="mono">
                      {formatCurrency(remaining, project.currency)}
                    </span>
                  </Row>
                  <div className="my-2 h-px bg-[var(--line)]" />
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--muted)]">Progress</span>
                    <span className="text-[13px] font-bold">{percent}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#eef0f3]">
                    <div
                      className="h-full rounded-full bg-[var(--green)]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-[14px] font-bold text-[var(--text)]">Client</h3>
                <div className="mt-3 flex items-center gap-2.5">
                  <Avatar name={project.client_name} size="lg" />
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-[var(--text)]">
                      {project.client_name || '—'}
                    </div>
                    <div className="truncate text-[11px] text-[var(--muted)]">
                      {project.client_company || project.client_email || ''}
                    </div>
                  </div>
                </div>
                <Link
                  to="/clients/$clientId"
                  params={{ clientId: project.client_id }}
                  className="mt-4 inline-flex h-[30px] w-full items-center justify-center rounded-[7px] border border-[var(--line-strong)] bg-white text-[12px] font-semibold text-[var(--text)] transition-colors hover:bg-[var(--panel-soft)]"
                >
                  View profile
                </Link>
              </Card>
            </div>
          </div>
        )}

        {tab === 'milestones' && (
          <MilestonesTab
            projectId={projectId}
            currency={project.currency}
            onAddClick={() => setAddMilestoneOpen(true)}
          />
        )}

        {tab === 'invoices' && (
          <Card className="overflow-hidden p-0">
            {projectInvoices.length === 0 ? (
              <div className="px-5 py-8 text-center text-[13px] text-[var(--muted)]">
                No invoices for this project yet. Generate one by completing a
                milestone.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[var(--panel-soft)] text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]">
                    <tr>
                      <th className="px-4 py-2.5">Invoice</th>
                      <th className="px-4 py-2.5">Issued</th>
                      <th className="px-4 py-2.5">Due</th>
                      <th className="px-4 py-2.5 text-right">Amount</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectInvoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="border-b border-[var(--line)] last:border-b-0"
                      >
                        <td className="mono px-4 py-3.5 font-semibold text-[var(--green-dark)]">
                          <Link
                            to="/invoices/$invoiceId"
                            params={{ invoiceId: inv.id }}
                            className="hover:underline"
                          >
                            {inv.invoice_number}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 text-[var(--muted)]">
                          {formatDate(inv.issue_date)}
                        </td>
                        <td className="px-4 py-3.5 text-[var(--muted)]">
                          {formatDate(inv.due_date)}
                        </td>
                        <td className="mono px-4 py-3.5 text-right font-semibold">
                          {formatCurrency(inv.total_amount, inv.currency)}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge status={inv.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </PageLayout>

      <AddMilestoneModal
        isOpen={addMilestoneOpen}
        onClose={() => setAddMilestoneOpen(false)}
        projectId={projectId}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[13px] transition-colors',
        active
          ? 'border-[var(--green)] font-semibold text-[var(--green-dark)]'
          : 'border-transparent font-medium text-[var(--muted)] hover:text-[var(--text)]'
      )}
    >
      {children}
    </button>
  );
}

function countCls(active: boolean) {
  return cn(
    'rounded-full px-1.5 text-[11px] font-semibold',
    active
      ? 'bg-[var(--green-soft)] text-[var(--green-dark)]'
      : 'bg-[#eef0f3] text-[var(--muted)]'
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--faint)]">
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[var(--muted)]">{label}</span>
      <span className="text-[14px] font-bold text-[var(--text)]">{children}</span>
    </div>
  );
}

function Metric({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[7px] border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-2.5">
      <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--faint)]">
        {label}
      </div>
      <div className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-[var(--text)]">
        {children}
      </div>
    </div>
  );
}

function normalizeDeliverables(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        : [];
    } catch {
      return [];
    }
  }
  return [];
}
