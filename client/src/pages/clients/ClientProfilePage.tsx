import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import {
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Send,
  Undo2,
  User,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/shared/Avatar';
import StatCard from '../../components/shared/StatCard';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import {
  useClient,
  useClientInviteStatus,
  useRevokeClientInvite,
  useSendClientInvite,
} from '../../hooks/useClients';
import { useProjects } from '../../hooks/useProjects';
import { useInvoices } from '../../hooks/useInvoices';
import { useProposals } from '../../hooks/useProposals';
import { formatCurrency, formatDate, cn } from '../../utils';
import { ApiError } from '../../lib/api';
import type { Invoice, Project, Proposal } from '../../types';
import ClientFormModal from './ClientFormModal';

type TabKey = 'overview' | 'projects' | 'invoices' | 'proposals';

export default function ClientProfilePage() {
  const { clientId } = useParams({ strict: false }) as { clientId: string };
  const [tab, setTab] = useState<TabKey>('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const { data: client, isLoading } = useClient(clientId);
  const { data: inviteStatus } = useClientInviteStatus(clientId);
  const { data: projects = [] } = useProjects('all');
  const { data: invoices = [] } = useInvoices('all');
  const { data: proposals = [] } = useProposals('all');
  const sendInvite = useSendClientInvite();
  const revokeInvite = useRevokeClientInvite();

  const clientProjects = useMemo(
    () => projects.filter((project) => project.client_id === clientId),
    [clientId, projects]
  );
  const clientInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.client_id === clientId),
    [clientId, invoices]
  );
  const clientProposals = useMemo(
    () => proposals.filter((proposal) => proposal.client_id === clientId),
    [clientId, proposals]
  );

  const totals = useMemo(() => {
    const billed = clientInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount),
      0
    );
    const outstanding = clientInvoices
      .filter((invoice) => invoice.status !== 'paid')
      .reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);

    const activity = [
      ...clientInvoices.map((invoice) => ({
        id: `invoice-${invoice.id}`,
        title: `${invoice.invoice_number} · ${formatCurrency(
          invoice.total_amount,
          invoice.currency
        )}`,
        subtitle:
          invoice.status === 'paid'
            ? 'Invoice paid'
            : invoice.status === 'sent'
              ? 'Invoice sent'
              : invoice.status === 'overdue'
                ? 'Invoice overdue'
                : 'Invoice drafted',
        at: invoice.created_at,
      })),
      ...clientProposals.map((proposal) => ({
        id: `proposal-${proposal.id}`,
        title: proposal.title,
        subtitle: `Proposal ${proposal.status}`,
        at: proposal.created_at,
      })),
    ].sort((a, b) => +new Date(b.at) - +new Date(a.at));

    return {
      billed,
      outstanding,
      activity: activity.slice(0, 5),
    };
  }, [clientInvoices, clientProposals]);

  async function handleSendInvite() {
    setInviteError(null);
    try {
      await sendInvite.mutateAsync(clientId);
    } catch (error) {
      setInviteError(error instanceof ApiError ? error.message : 'Could not send invite');
    }
  }

  async function handleRevokeInvite() {
    setInviteError(null);
    try {
      await revokeInvite.mutateAsync(clientId);
      setRevokeOpen(false);
    } catch (error) {
      setInviteError(
        error instanceof ApiError ? error.message : 'Could not revoke invite'
      );
    }
  }

  if (isLoading) {
    return (
      <PageLayout title="Loading client…">
        <div className="text-sm text-[var(--muted)]">Loading client…</div>
      </PageLayout>
    );
  }

  if (!client) {
    return (
      <PageLayout
        title="Client not found"
        breadcrumb={[{ label: 'Clients' }, { label: 'Not found' }]}
      >
        <Link
          to="/clients"
          className="text-[13px] font-semibold text-[var(--green-dark)] hover:underline"
        >
          ← Back to Clients
        </Link>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        title={client.company || client.name}
        subtitle={`Client since ${formatDate(client.created_at)}`}
        breadcrumb={[{ label: 'Clients' }, { label: client.company || client.name }]}
        actions={
          <>
            <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
              Edit
            </Button>
            <Link to="/proposals">
              <Button>
                <Plus className="h-3.5 w-3.5" strokeWidth={2.25} /> New proposal
              </Button>
            </Link>
          </>
        }
      >
        <div className="-mt-2 mb-5 border-b border-[var(--line)]">
          <div className="-mb-px flex gap-0.5">
            <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>
              Overview
            </TabButton>
            <TabButton active={tab === 'projects'} onClick={() => setTab('projects')}>
              Projects
              <CountPill active={tab === 'projects'}>{clientProjects.length}</CountPill>
            </TabButton>
            <TabButton active={tab === 'invoices'} onClick={() => setTab('invoices')}>
              Invoices
              <CountPill active={tab === 'invoices'}>{clientInvoices.length}</CountPill>
            </TabButton>
            <TabButton active={tab === 'proposals'} onClick={() => setTab('proposals')}>
              Proposals
              <CountPill active={tab === 'proposals'}>{clientProposals.length}</CountPill>
            </TabButton>
          </div>
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <Card className="p-5">
              <div className="flex flex-col items-center border-b border-[var(--line)] pb-5 text-center">
                <Avatar name={client.company || client.name} size="xl" />
                <h2 className="mt-3 text-[18px] font-bold text-[var(--text)]">
                  {client.company || client.name}
                </h2>
                <p className="mt-1 text-[12px] text-[var(--muted)]">{client.name}</p>
              </div>

              <div className="mt-4 space-y-3 text-[13px]">
                <InfoRow icon={User} text={client.name} />
                <InfoRow icon={Mail} text={client.email || 'No email added'} />
                <InfoRow icon={Phone} text={client.phone || 'No phone added'} />
                <InfoRow icon={MapPin} text={client.location || 'No location added'} />
              </div>

              <div className="mt-5 rounded-[10px] border border-[var(--line)] bg-[var(--panel-soft)] p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[12px] font-semibold text-[var(--text)]">
                      Client portal
                    </div>
                    <div className="mt-1 text-[11px] text-[var(--muted)]">
                      {inviteMessage(inviteStatus?.status)}
                    </div>
                  </div>
                  <PortalBadge status={inviteStatus?.status || 'none'} />
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleSendInvite}
                    isLoading={sendInvite.isPending}
                    disabled={!client.email || inviteStatus?.status === 'accepted'}
                  >
                    <Send className="h-3.5 w-3.5" strokeWidth={2} />
                    {inviteStatus?.status === 'pending' ? 'Resend invite' : 'Send invite'}
                  </Button>

                  {inviteStatus?.status === 'pending' && (
                    <Button variant="ghost" onClick={() => setRevokeOpen(true)}>
                      <Undo2 className="h-3.5 w-3.5" strokeWidth={2} />
                      Revoke invite
                    </Button>
                  )}
                </div>

                {!client.email && (
                  <div className="mt-3 rounded-[8px] border border-[#FDE68A] bg-[var(--amber-soft)] px-3 py-2 text-[12px] text-[#92400e]">
                    Add an email address before inviting this client.
                  </div>
                )}
                {inviteError && (
                  <div className="mt-3 rounded-[8px] border border-[#FECACA] bg-[var(--red-soft)] px-3 py-2 text-[12px] text-[var(--red)]">
                    {inviteError}
                  </div>
                )}
              </div>
            </Card>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard
                  label="Total billed"
                  value={formatCurrency(totals.billed, client.currency)}
                  tone="green"
                />
                <StatCard
                  label="Outstanding"
                  value={formatCurrency(totals.outstanding, client.currency)}
                  tone="amber"
                />
                <StatCard
                  label="Lifetime projects"
                  value={String(clientProjects.length)}
                  tone="blue"
                />
              </div>

              <Card className="overflow-hidden p-0">
                <div className="border-b border-[var(--line)] px-5 py-3.5">
                  <h3 className="text-[14px] font-bold text-[var(--text)]">
                    Recent activity
                  </h3>
                </div>
                {totals.activity.length === 0 ? (
                  <div className="px-5 py-8 text-center text-[13px] text-[var(--muted)]">
                    No activity yet for this client.
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--line)]">
                    {totals.activity.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 px-5 py-3.5"
                      >
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--green)]" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-semibold text-[var(--text)]">
                            {item.title}
                          </div>
                          <div className="mt-0.5 text-[12px] text-[var(--muted)]">
                            {item.subtitle}
                          </div>
                        </div>
                        <div className="text-[11px] text-[var(--faint)]">
                          {formatDate(item.at)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {tab === 'projects' && (
          <ProjectsTable projects={clientProjects} currency={client.currency} />
        )}

        {tab === 'invoices' && (
          <InvoicesTable invoices={clientInvoices} currency={client.currency} />
        )}

        {tab === 'proposals' && (
          <ProposalsTable proposals={clientProposals} currency={client.currency} />
        )}
      </PageLayout>

      <ClientFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        client={client}
      />

      <ConfirmDialog
        isOpen={revokeOpen}
        onClose={() => setRevokeOpen(false)}
        onConfirm={handleRevokeInvite}
        title="Revoke invite?"
        message="This will invalidate the current client portal invitation link."
        confirmLabel="Revoke invite"
        isDanger
        isLoading={revokeInvite.isPending}
      />
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[13px] transition-colors',
        active
          ? 'border-[var(--green)] font-semibold text-[var(--green-dark)]'
          : 'border-transparent font-medium text-[var(--muted)] hover:text-[var(--text)]'
      )}
    >
      {children}
    </button>
  );
}

function CountPill({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'rounded-full px-1.5 text-[11px] font-semibold',
        active
          ? 'bg-[var(--green-soft)] text-[var(--green-dark)]'
          : 'bg-[#eef0f3] text-[var(--muted)]'
      )}
    >
      {children}
    </span>
  );
}

function InfoRow({
  icon: Icon,
  text,
}: {
  icon: typeof User;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-4 w-4 shrink-0 text-[var(--faint)]" strokeWidth={1.7} />
      <span className="text-[var(--text)]">{text}</span>
    </div>
  );
}

function PortalBadge({
  status,
}: {
  status: 'none' | 'pending' | 'accepted' | 'expired' | 'revoked';
}) {
  const map = {
    none: 'draft',
    pending: 'sent',
    accepted: 'accepted',
    expired: 'declined',
    revoked: 'declined',
  } as const;

  return <Badge status={map[status]} />;
}

function inviteMessage(status?: string) {
  switch (status) {
    case 'pending':
      return 'Invitation sent and waiting for the client to accept it.';
    case 'accepted':
      return 'Client account is active and can access the portal.';
    case 'expired':
      return 'Previous invite expired. You can send a fresh one.';
    case 'revoked':
      return 'Previous invite was revoked. Send a new link when ready.';
    default:
      return 'Invite this client to the read-only portal for projects and invoices.';
  }
}

function ProjectsTable({
  projects,
  currency,
}: {
  projects: Project[];
  currency: string;
}) {
  if (projects.length === 0) {
    return (
      <Card className="p-0">
        <EmptyState
          icon={FileText}
          heading="No projects for this client yet"
          subtext="Accepted proposals will start showing up here once they become projects."
        />
      </Card>
    );
  }

  return (
    <TableCard>
      <table className="w-full text-left text-[13px]">
        <thead className="bg-[var(--panel-soft)] text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]">
          <tr>
            <th className="px-4 py-2.5">Project</th>
            <th className="px-4 py-2.5">Start</th>
            <th className="px-4 py-2.5">Due</th>
            <th className="px-4 py-2.5 text-right">Value</th>
            <th className="px-4 py-2.5">Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-[var(--line)] last:border-b-0">
              <td className="px-4 py-3.5 font-semibold text-[var(--text)]">
                <Link
                  to="/projects/$projectId"
                  params={{ projectId: project.id }}
                  className="hover:text-[var(--green-dark)] hover:underline"
                >
                  {project.title}
                </Link>
              </td>
              <td className="px-4 py-3.5 text-[var(--muted)]">
                {formatDate(project.start_date)}
              </td>
              <td className="px-4 py-3.5 text-[var(--muted)]">
                {formatDate(project.end_date)}
              </td>
              <td className="mono px-4 py-3.5 text-right font-semibold">
                {formatCurrency(project.total_amount || 0, project.currency || currency)}
              </td>
              <td className="px-4 py-3.5">
                <Badge status={project.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}

function InvoicesTable({
  invoices,
  currency,
}: {
  invoices: Invoice[];
  currency: string;
}) {
  if (invoices.length === 0) {
    return (
      <Card className="p-0">
        <EmptyState
          icon={FileText}
          heading="No invoices for this client yet"
          subtext="Generated invoices will show up here once milestones are billed."
        />
      </Card>
    );
  }

  return (
    <TableCard>
      <table className="w-full text-left text-[13px]">
        <thead className="bg-[var(--panel-soft)] text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]">
          <tr>
            <th className="px-4 py-2.5">Invoice</th>
            <th className="px-4 py-2.5">Project</th>
            <th className="px-4 py-2.5">Issued</th>
            <th className="px-4 py-2.5">Due</th>
            <th className="px-4 py-2.5 text-right">Amount</th>
            <th className="px-4 py-2.5">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b border-[var(--line)] last:border-b-0">
              <td className="mono px-4 py-3.5 font-semibold text-[var(--green-dark)]">
                <Link
                  to="/invoices/$invoiceId"
                  params={{ invoiceId: invoice.id }}
                  className="hover:underline"
                >
                  {invoice.invoice_number}
                </Link>
              </td>
              <td className="px-4 py-3.5 text-[var(--text)]">
                {invoice.project_title || invoice.milestone_title || '—'}
              </td>
              <td className="px-4 py-3.5 text-[var(--muted)]">
                {formatDate(invoice.issue_date)}
              </td>
              <td className="px-4 py-3.5 text-[var(--muted)]">
                {formatDate(invoice.due_date)}
              </td>
              <td className="mono px-4 py-3.5 text-right font-semibold">
                {formatCurrency(invoice.total_amount, invoice.currency || currency)}
              </td>
              <td className="px-4 py-3.5">
                <Badge status={invoice.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}

function ProposalsTable({
  proposals,
  currency,
}: {
  proposals: Proposal[];
  currency: string;
}) {
  if (proposals.length === 0) {
    return (
      <Card className="p-0">
        <EmptyState
          icon={FileText}
          heading="No proposals for this client yet"
          subtext="Draft and sent proposals will appear here as soon as you create them."
        />
      </Card>
    );
  }

  return (
    <TableCard>
      <table className="w-full text-left text-[13px]">
        <thead className="bg-[var(--panel-soft)] text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]">
          <tr>
            <th className="px-4 py-2.5">Proposal</th>
            <th className="px-4 py-2.5">Valid until</th>
            <th className="px-4 py-2.5 text-right">Amount</th>
            <th className="px-4 py-2.5">Status</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal) => (
            <tr key={proposal.id} className="border-b border-[var(--line)] last:border-b-0">
              <td className="px-4 py-3.5 font-semibold text-[var(--text)]">
                {proposal.title}
              </td>
              <td className="px-4 py-3.5 text-[var(--muted)]">
                {formatDate(proposal.valid_until)}
              </td>
              <td className="mono px-4 py-3.5 text-right font-semibold">
                {formatCurrency(proposal.amount, proposal.currency || currency)}
              </td>
              <td className="px-4 py-3.5">
                <Badge status={proposal.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}

function TableCard({ children }: { children: ReactNode }) {
  return <Card className="overflow-hidden p-0">{children}</Card>;
}
